"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CoreCanvas } from "@/three/core/loadCore";
import { store } from "@/three/core/store";
import { setCameraOverride } from "@/three/core/camera";
import { Vector3 } from "three";

/**
 * Query: ?formation=0..5&light=unlit|lit&tier=A|B
 * Sets the store to the requested state, disables idle motion and pointer
 * influence so the frame is still, and flags `data-capture-ready` on the
 * body once the readiness contract has fired.
 */
export default function CaptureStage() {
  const params = useSearchParams();
  const formation = Math.min(5, Math.max(0, Number(params.get("formation") ?? 0)));
  const light = params.get("light") === "lit" ? "lit" : "unlit";
  const tier = params.get("tier") === "B" ? "B" : "A";
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
    } else {
      setCameraOverride(null);
    }
  }, [formation, light, params]);

  useEffect(() => {
    if (!ready) return;
    // Hold the heat gate every frame in case the driver touches it.
    let raf = 0;
    const hold = () => {
      store.heatGate = light === "lit" ? 1.3 : -0.3;
      raf = requestAnimationFrame(hold);
    };
    hold();
    const t = setTimeout(() => {
      document.body.setAttribute("data-capture-ready", "1");
    }, 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [ready, light]);

  return (
    <main className="fixed inset-0 bg-obsidian-900">
      <CoreCanvas
        tier={tier}
        capture
        onLive={() => setReady(true)}
        onFail={() => document.body.setAttribute("data-capture-failed", "1")}
      />
    </main>
  );
}
