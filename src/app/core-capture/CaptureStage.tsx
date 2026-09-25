"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CoreCanvas } from "@/three/core/loadCore";
import { store } from "@/three/core/store";
import { setCameraOverride } from "@/three/core/camera";
import { pillarHoldVh } from "@/three/core/formationTrack";
import { BEAT_START_VH } from "@/three/core/timeline";
import { Vector3 } from "three";

/**
 * Query: ?formation=0..5&light=unlit|lit&tier=A|B, plus bend=0..1 (the
 * Beat 2 curve), centre=1 and cam=px,py,pz,lx,ly,lz.
 * Sets the store to the requested state, disables idle motion and pointer
 * influence so the frame is still, and flags `data-capture-ready` on the
 * body once the readiness contract has fired.
 */
export default function CaptureStage() {
  const params = useSearchParams();
  const formation = Math.min(5, Math.max(0, Number(params.get("formation") ?? 0)));
  const light = params.get("light") === "lit" ? "lit" : "unlit";
  const bend = Math.min(1, Math.max(0, Number(params.get("bend") ?? 0)));
  // ?centre=1: frame the object in the middle of a portrait screen, as the
  // interior page heroes need (the home hero's own poster stays off-centre).
  const centre = params.get("centre") === "1";
  const tier = params.get("tier") === "B" ? "B" : "A";
  // ?shape=padlock: a capture-only shape (worker/shapes.ts) in slot 5.
  const shape = params.get("shape") ?? undefined;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    store.from = formation as typeof store.from;
    store.to = formation as typeof store.to;
    store.mix = 0;
    store.noise = 0;
    store.opacity = 1;
    store.ground = formation === 1 || formation === 4 ? 1 : 0;
    store.scrollVh = 0;
    // Freeze the light state; the driver only animates the gate after onLive
    // when scrolledPastArrival is false, so pin it as "past" and set it by hand.
    store.scrolledPastArrival = true;
    store.heatGate = light === "lit" ? 1.3 : -0.3;
    document.body.style.background = "#0A0C10";
    const cam = params.get("cam");
    if (cam) {
      const v = cam.split(",").map(Number);
      if (v.length === 6 && v.every((n) => Number.isFinite(n))) {
        setCameraOverride({ at: 0, position: new Vector3(v[0], v[1], v[2]), lookAt: new Vector3(v[3], v[4], v[5]) });
      }
    } else if (formation === 0 && params.get("centre") === "1") {
      // The hero key moved right by its own look-at offset, so the sheet's
      // ember line sits in the middle of a portrait frame.
      setCameraOverride({ at: 0, position: new Vector3(-0.3, 1.3, 6.0), lookAt: new Vector3(0, -0.15, 0) });
    } else {
      setCameraOverride(null);
    }
  }, [formation, light, params]);

  // Hold the requested state every frame from mount. The canvas loads
  // asynchronously and resets the store when it mounts, which is after this
  // component's first effect, so a one-off write was lost and every capture
  // came out as formation 0.
  useEffect(() => {
    let raf = 0;
    const hold = () => {
      store.from = formation as typeof store.from;
      store.to = formation as typeof store.to;
      store.mix = 0;
      store.noise = 0;
      store.opacity = 1;
      store.ground = formation === 1 || formation === 4 ? 1 : 0;
      store.scrolledPastArrival = true;
      store.heatGate = light === "lit" ? 1.3 : -0.3;
      store.captureBend = bend;
      // The camera the page uses for this formation: the hero key for the
      // sheet, the pillar key while a pillar formation holds.
      store.scrollVh = formation >= 1 && formation <= 4 ? pillarHoldVh(formation) : centre && formation === 5 ? BEAT_START_VH[8] + 80 : 0;
      raf = requestAnimationFrame(hold);
    };
    hold();
    return () => cancelAnimationFrame(raf);
  }, [formation, light, bend, centre]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      document.body.setAttribute("data-capture-ready", "1");
    }, 1500);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <main className="fixed inset-0 bg-obsidian-900">
      <CoreCanvas
        tier={tier}
        capture
        shape={shape}
        onLive={() => setReady(true)}
        onFail={() => document.body.setAttribute("data-capture-failed", "1")}
      />
    </main>
  );
}
