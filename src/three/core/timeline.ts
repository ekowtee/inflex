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

/** Nominal beat lengths in viewport heights — SCROLL_NARRATIVE.md §6. */
export const BEAT_LENGTH_VH: Record<number, number> = {
  0: 100,
  1: 30,
  2: 110,
  3: 120,
  4: 320,
  5: 120,
  6: 60,
  7: 0,
  8: 110,
  9: 60,
};

/** Cumulative start of each beat on the virtual timeline. */
export const BEAT_START_VH: Record<number, number> = (() => {
  const out: Record<number, number> = {};
  let acc = 0;
  for (let b = 0; b <= 9; b += 1) {
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
 */
export function virtualVh(scrollY: number, viewportHeight: number, beats: BeatRect[]): { vh: number; beat: number; progress: number } {
  if (!beats.length) return { vh: (scrollY / viewportHeight) * 100, beat: 0, progress: 0 };
  let current = beats[0];
  for (const b of beats) {
    if (scrollY >= b.top) current = b;
  }
  const extent = Math.max(current.height - viewportHeight, viewportHeight * 0.5);
  const progress = Math.min(1, Math.max(0, (scrollY - current.top) / extent));
  const length = BEAT_LENGTH_VH[current.beat] ?? 100;
  const start = BEAT_START_VH[current.beat] ?? 0;
  // Between the end of a beat's scroll extent and the next beat's top the
  // timeline holds at the beat's end.
  return { vh: start + progress * length, beat: current.beat, progress };
}

/** §8.5 canvas column as node opacity. Hidden ranges are 0. */
export function opacityAt(vh: number): number {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
  if (vh < 240) return 1;
  if (vh < 340) return 0.7;
  if (vh < 360) return lerp(0.7, 1, (vh - 340) / 20);
  if (vh < 680) return 1;
  if (vh < 710) return lerp(1, 0, (vh - 680) / 30);
  if (vh < 920) return 0;
  if (vh < 980) return lerp(0, 1, (vh - 920) / 60);
  if (vh < 1030) return 1;
  if (vh < 1090) return lerp(1, 0, (vh - 1030) / 60);
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
 * Attach the driver. Writes `store.scrollVh`, `store.opacity` and
 * `store.scrolledPastArrival`; writes `data-active` and `aria-current` on
 * the pinned chapter; slides the trust strip's row in as it enters.
 * Returns a disposer.
 */
export function attachTimeline(options: TimelineOptions = {}): () => void {
  let beats = measureBeats();
  let frame = 0;
  let lastPillar = -1;
  let lastBeat = -2;

  const pin = document.querySelector<HTMLElement>('[data-beat="4"] [data-pin]');
  const pillarLinks = pin ? Array.from(pin.querySelectorAll<HTMLElement>("[data-pillar-link]")) : [];
  const slideRow = document.querySelector<HTMLElement>("[data-slide-row]");
  const slideBeat = () => beats.find((b) => b.beat === 1);

  const apply = () => {
    frame = 0;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const sample = sampleTimeline(scrollY, vh, beats);

    store.scrollVh = sample.vh;
    store.opacity = sample.opacity;
    if (sample.vh > BEAT_START_VH[2]) store.scrolledPastArrival = true;

    if (pin && sample.pillar !== lastPillar) {
      lastPillar = sample.pillar;
      pin.dataset.active = String(sample.pillar);
      pillarLinks.forEach((link, i) => {
        if (i === sample.pillar) link.setAttribute("aria-current", "true");
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

    if (sample.beat !== lastBeat) {
      lastBeat = sample.beat;
      document.documentElement.dataset.beatCurrent = String(sample.beat);
    }
    options.onSample?.(sample);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(apply);
  };
  const remeasure = () => {
    beats = measureBeats();
    schedule();
  };

  window.addEventListener("scroll", schedule, { passive: true });
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
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", remeasure);
    observer?.disconnect();
    pillarLinks.forEach((link, i) => link.removeEventListener("focus", focusHandlers[i]));
    if (frame) cancelAnimationFrame(frame);
    delete document.documentElement.dataset.beatCurrent;
    if (slideRow) slideRow.style.transform = "";
  };
}
