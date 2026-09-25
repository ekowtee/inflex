/**
 * The scroll spine — CREATIVE_DIRECTION_3D.md §8.3, SCROLL_NARRATIVE.md §8.5.
 *
 * One driver maps the page's real scroll position onto the narrative's
 * virtual timeline, writes the bridge store for the scene, and writes the
 * few DOM attributes the chapters read (PHASE2_BRIEF.md §5).
 *
 * Why a virtual timeline: the narrative gives every beat a nominal length in
 * viewport heights (the hero is 100, the trust strip 30, the pillars 320)
 * and keys the camera, the canvas opacity and the formations to those
 * numbers. Real sections are as tall as their content. So the driver finds
 * the beat under the viewport top, measures how far through it the page
 * has scrolled, and reports "nominal start + progress × nominal length".
 * Everything downstream keeps using the narrative's numbers, and a chapter
 * can change height without moving a single key.
 *
 * No GSAP here. The pin is CSS `position: sticky` (globals.css) so it works
 * with keyboard scrolling, with Lenis, on Safari trackpads and under
 * reduced motion; the driver is a passive scroll listener throttled to one
 * measurement per frame. Scrub smoothing for the morphs lands in Phase 3
 * inside the scene's own frame loop, where damping belongs.
 */
import { store } from "./store";

/**
 * Nominal beat lengths in viewport heights — SCROLL_NARRATIVE.md §6. Beat
 * 5.5 is the intelligence band between the ledger and the partner wall
 * (owner, 23 September 2026); Beat 7 (Voices) is omitted and has length 0.
 */
export const BEAT_ORDER = [0, 1, 2, 3, 4, 5, 5.5, 6, 7, 8, 9] as const;

export const BEAT_LENGTH_VH: Record<number, number> = {
  0: 100,
  1: 30,
  2: 110,
  3: 120,
  4: 320,
  5: 120,
  5.5: 90,
  6: 60,
  7: 0,
  8: 110,
  9: 60,
};

/**
 * Beats whose entry is part of the timeline: the beat above hands the last
 * ENTRY_LEAD_VH[b] of its virtual length to the stretch where beat b rises
 * from the viewport bottom to the top, instead of finishing early and holding
 * while b comes up. Beat 4: the network fabric forms as the pillars come up,
 * from a third of the way up to the pin (owner, 25 September 2026), which
 * is formationTrack's [b4 − 40, b4] on a 60 vh lead.
 */
export const ENTRY_LEAD_VH: Record<number, number> = { 4: 60 };

/** Cumulative start of each beat on the virtual timeline. */
export const BEAT_START_VH: Record<number, number> = (() => {
  const out: Record<number, number> = {};
  let acc = 0;
  for (const b of BEAT_ORDER) {
    out[b] = acc;
    acc += BEAT_LENGTH_VH[b];
  }
  return out;
})();

export const TIMELINE_END_VH = BEAT_START_VH[9] + BEAT_LENGTH_VH[9];

export interface BeatRect {
  beat: number;
  top: number;
  height: number;
  element: HTMLElement;
}

/** Measure every `[data-beat]` section in document coordinates. */
export function measureBeats(): BeatRect[] {
  const out: BeatRect[] = [];
  const scrollY = window.scrollY;
  document.querySelectorAll<HTMLElement>("section[data-beat]").forEach((element) => {
    const beat = Number(element.dataset.beat);
    if (!Number.isFinite(beat)) return;
    const rect = element.getBoundingClientRect();
    out.push({ beat, top: rect.top + scrollY, height: rect.height, element });
  });
  return out.sort((a, b) => a.top - b.top);
}

export interface TimelineSample {
  /** Position on the narrative's virtual timeline, in viewport heights. */
  vh: number;
  /** The beat under the viewport top, or −1 above the page. */
  beat: number;
  /** 0 to 1 through that beat. */
  progress: number;
  /** Node opacity for the scene — §8.5's canvas column. */
  opacity: number;
  /** Active pillar row while pinned. */
  pillar: number;
}

/**
 * Where the viewport top sits on the virtual timeline. For each beat the
 * scrollable extent is its height minus one viewport (so a 100 svh beat
 * is a point and a 420 svh pinned beat scrolls for 320), with a floor of
 * one viewport so short beats still take a full nominal stride to pass.
 * A beat followed by one in ENTRY_LEAD_VH maps its scroll up to that beat's
 * top instead, with no hold.
 */
export function virtualVh(scrollY: number, viewportHeight: number, beats: BeatRect[]): { vh: number; beat: number; progress: number } {
  if (!beats.length) return { vh: (scrollY / viewportHeight) * 100, beat: 0, progress: 0 };
  let index = 0;
  beats.forEach((b, i) => {
    if (scrollY >= b.top) index = i;
  });
  const current = beats[index];
  const length = BEAT_LENGTH_VH[current.beat] ?? 100;
  const start = BEAT_START_VH[current.beat] ?? 0;
  const next = beats[index + 1];
  const lead = next && scrollY >= current.top ? ENTRY_LEAD_VH[next.beat] : undefined;
  if (lead !== undefined) {
    // Up to the next beat's top reaching the viewport bottom, this beat's
    // own scroll covers its length less the lead; the entry covers the lead.
    const span = next.top - current.top;
    const into = scrollY - current.top;
    const own = span - viewportHeight;
    if (own <= 0) {
      const progress = Math.min(1, into / span);
      return { vh: start + progress * length, beat: current.beat, progress };
    }
    if (into < own) {
      const progress = into / own;
      return { vh: start + progress * (length - lead), beat: current.beat, progress };
    }
    const entry = Math.min(1, (into - own) / viewportHeight);
    return { vh: start + length - lead + entry * lead, beat: current.beat, progress: 1 };
  }
  const extent = Math.max(current.height - viewportHeight, viewportHeight * 0.5);
  const progress = Math.min(1, Math.max(0, (scrollY - current.top) / extent));
  // Between the end of a beat's scroll extent and the next beat's top the
  // timeline holds at the beat's end.
  return { vh: start + progress * length, beat: current.beat, progress };
}

/**
 * §8.5 canvas column as node opacity. Hidden ranges are 0.
 *
 * Keyed to BEAT_START_VH rather than the narrative's literal numbers: the
 * narrative's 920 assumed Beat 7 (Voices) at 860 to 920, and with Voices
 * omitted the ask starts at 860, so a literal 920 kept the Core off for
 * almost the whole ask.
 *
 * Beat 3 runs its cases and counters across the full width, over the
 * object, so the Core steps back to 0.3 there rather than the narrative's
 * 0.7: at 0.7 the ember line ran through the counter labels.
 */
export function opacityAt(vh: number): number {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
  const b3 = BEAT_START_VH[3];
  const b4 = BEAT_START_VH[4];
  const b5 = BEAT_START_VH[5];
  const b55 = BEAT_START_VH[5.5];
  const b6 = BEAT_START_VH[6];
  const b8 = BEAT_START_VH[8];
  const b9 = BEAT_START_VH[9];
  if (vh < b3 - 10) return 1;
  if (vh < b3 + 10) return lerp(1, 0.3, (vh - (b3 - 10)) / 20);
  if (vh < b4 - 20) return 0.3;
  if (vh < b4) return lerp(0.3, 1, (vh - (b4 - 20)) / 20);
  if (vh < b5) return 1;
  if (vh < b5 + 30) return lerp(1, 0, (vh - b5) / 30);
  // The intelligence band: the Core fades up under the ledger's opaque
  // Ivory, holds for the band, and fades out under the partner wall.
  if (vh < b55 - 60) return 0;
  if (vh < b55) return lerp(0, 1, (vh - (b55 - 60)) / 60);
  if (vh < b6) return 1;
  if (vh < b6 + 20) return lerp(1, 0, (vh - b6) / 20);
  // The ask arrives with its object: the fade runs over the last 20 vh of
  // the partner wall, whose opaque Ivory still covers the canvas, so the
  // Core is already there when the dark band comes up from below.
  if (vh < b8 - 40) return 0;
  if (vh < b8) return lerp(0, 1, (vh - (b8 - 40)) / 40);
  if (vh < b9) return 1;
  if (vh < b9 + 40) return lerp(1, 0, (vh - b9) / 40);
  return 0;
}

export function sampleTimeline(scrollY: number, viewportHeight: number, beats: BeatRect[]): TimelineSample {
  const { vh, beat, progress } = virtualVh(scrollY, viewportHeight, beats);
  const pillar = beat === 4 ? Math.min(3, Math.floor(progress * 4)) : 0;
  return { vh, beat, progress, opacity: opacityAt(vh), pillar };
}

export interface TimelineOptions {
  /** Skip the decorative slide (reduced motion). */
  reducedMotion?: boolean;
  onSample?: (sample: TimelineSample) => void;
}

/**
 * Attach the driver. Writes `store.scrollVh`, `store.opacity`,
 * `store.askEntry`, `store.askExit` and `store.scrolledPastArrival`; writes `data-active` and `aria-current` on
 * the pinned chapter; slides the trust strip's row in as it enters.
 * Returns a disposer.
 */
export function attachTimeline(options: TimelineOptions = {}): () => void {
  let beats = measureBeats();
  let frame = 0;
  let lastPillar = -1;
  let lastNarrow: boolean | null = null;
  let lastBeat = -2;

  const pin = document.querySelector<HTMLElement>('[data-beat="4"] [data-pin]');
  const pillarLinks = pin ? Array.from(pin.querySelectorAll<HTMLElement>("[data-pillar-link]")) : [];
  const slideRow = document.querySelector<HTMLElement>("[data-slide-row]");
  // The two threads that are born from the Core: the spine places each at
  // the projected point it drops from, and keeps it there while the camera
  // settles after the scroll stops.
  const threadSlots = ([["2", "thread2X"], ["4", "thread4X"]] as const)
    .map(([n, keyName]) => ({ el: document.querySelector<HTMLElement>(`[data-thread-slot="${n}"]`), keyName }))
    .filter((t): t is { el: HTMLElement; keyName: "thread2X" | "thread4X" } => t.el !== null);
  let lastScrollAt = 0;
  const slideBeat = () => beats.find((b) => b.beat === 1);

  const apply = () => {
    frame = 0;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const sample = sampleTimeline(scrollY, vh, beats);

    store.scrollVh = sample.vh;
    const ask = beats.find((b) => b.beat === 8);
    store.askEntry = ask ? Math.min(1, Math.max(0, 1 - (ask.top - scrollY) / vh)) : 0;
    const doors = beats.find((b) => b.beat === 9);
    store.askExit = doors ? Math.min(1, Math.max(0, 1 - (doors.top - scrollY) / vh)) : 0;
    // The mark dissolves as the ask leaves: gone by the time the doors are
    // under half way up, rather than after they reach the top.
    const exitT = Math.min(1, Math.max(0, (store.askExit - 0.05) / 0.4));
    const leaving = sample.beat >= 8 ? 1 - exitT * exitT * (3 - 2 * exitT) : 1;
    // Below lg the copy runs full width over the object in every beat after
    // the hero, so the Core recedes to a texture there.
    const narrow = window.innerWidth < 1024;
    // Below lg, from the turning point to the end of the pillars, the beats
    // carry the curve and the four objects as stills; the live Core fades out
    // there rather than showing the same object twice behind the copy.
    const stillsCarry =
      narrow && sample.vh < BEAT_START_VH[5] + 30
        ? Math.min(1, Math.max(0, (sample.vh - BEAT_START_VH[2]) / 20))
        : 0;
    store.opacity =
      (narrow && sample.vh > 60
        ? sample.opacity * Math.max(0.35, 1 - (sample.vh - 60) / 60) * (1 - 0.4 * store.askEntry)
        : sample.opacity) *
      leaving *
      (1 - stillsCarry);
    if (sample.vh > BEAT_START_VH[2]) store.scrolledPastArrival = true;

    // Below lg every row is open and none is active, so no link is
    // "current" there; a screen reader would otherwise hear a state the page
    // does not show.
    if (pin && (sample.pillar !== lastPillar || narrow !== lastNarrow)) {
      lastPillar = sample.pillar;
      lastNarrow = narrow;
      pin.dataset.active = String(sample.pillar);
      pillarLinks.forEach((link, i) => {
        if (!narrow && i === sample.pillar) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }

    if (slideRow && !options.reducedMotion) {
      const b = slideBeat();
      if (b) {
        // Enters over the first 60% of a viewport as the strip rises into view.
        const entered = (vh - (b.top - scrollY)) / (vh * 0.6);
        const p = Math.min(1, Math.max(0, entered));
        const eased = 1 - Math.pow(1 - p, 3);
        slideRow.style.transform = `translate3d(${((1 - eased) * 160).toFixed(1)}px, 0, 0)`;
      }
    }

    // Each thread exists only once the thing it drops from exists: the Beat
    // 2 thread once the sheet has resolved and relit, the Beat 4 thread on
    // the last row, when the column field has formed. Otherwise it is
    // unplaced, and an unplaced thread does not draw (globals.css).
    const bornFrom = {
      thread2X: sample.vh >= BEAT_START_VH[2] + (BEAT_START_VH[3] - BEAT_START_VH[2]) * 0.7,
      thread4X: sample.beat === 4 && sample.pillar === 3,
    } as const;
    for (const { el, keyName } of threadSlots) {
      if (!store.threadReady || !bornFrom[keyName]) {
        el.style.removeProperty("--thread-x");
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const x = Math.min(r.width - 1, Math.max(0, store[keyName] - r.left));
      el.style.setProperty("--thread-x", `${x.toFixed(1)}px`);
    }

    if (sample.beat !== lastBeat) {
      lastBeat = sample.beat;
      document.documentElement.dataset.beatCurrent = String(sample.beat);
    }
    options.onSample?.(sample);
    // The scene eases toward the reader for about a second after the last
    // scroll; keep the threads in step until it has settled.
    if (performance.now() - lastScrollAt < 1500) schedule();
  };

  function schedule() {
    if (!frame) frame = requestAnimationFrame(apply);
  }
  const onScroll = () => {
    lastScrollAt = performance.now();
    schedule();
  };
  const remeasure = () => {
    beats = measureBeats();
    schedule();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasure);
  // Content settles after fonts and images; re-measure when the body grows.
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(remeasure) : null;
  observer?.observe(document.body);

  // Focus on a pillar link scrolls the pin to that row's sub-range.
  const focusHandlers = pillarLinks.map((link, i) => {
    const handler = () => {
      // After the browser's own scroll-into-view for the focused link, which
      // would otherwise land on top of ours.
      requestAnimationFrame(() => {
        const b = beats.find((x) => x.beat === 4);
        if (!b || window.innerWidth < 1024) return;
        const extent = Math.max(b.height - window.innerHeight, 1);
        const target = b.top + (extent * i) / 4 + 1;
        if (Math.abs(window.scrollY - target) > 4) window.scrollTo({ top: target, behavior: "auto" });
      });
    };
    link.addEventListener("focus", handler);
    return handler;
  });

  remeasure();

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", remeasure);
    observer?.disconnect();
    pillarLinks.forEach((link, i) => link.removeEventListener("focus", focusHandlers[i]));
    if (frame) cancelAnimationFrame(frame);
    delete document.documentElement.dataset.beatCurrent;
    if (slideRow) slideRow.style.transform = "";
  };
}
