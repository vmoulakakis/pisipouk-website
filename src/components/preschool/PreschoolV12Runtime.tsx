import { useEffect, useState } from "react";
import { PreschoolGamesV13 } from "@/components/preschool/PreschoolGamesV13";

function patchBabylon(B: any) {
  const proto = B?.ShadowGenerator?.prototype;
  if (!proto || proto.__pisipoukTransformShadowPatch) return;
  const original = proto.addShadowCaster;
  proto.addShadowCaster = function (node: any, includeDescendants?: boolean) {
    if (node && typeof node.getBoundingInfo !== "function" && typeof node.getChildMeshes === "function") {
      const meshes = node.getChildMeshes(false) || [];
      for (const mesh of meshes) {
        if (mesh && typeof mesh.getBoundingInfo === "function") {
          original.call(this, mesh, false);
        }
      }
      return this;
    }
    return original.call(this, node, includeDescendants);
  };
  proto.__pisipoukTransformShadowPatch = true;
}

function ensureBabylon(): Promise<any> {
  const win = window as any;
  if (win.BABYLON) {
    patchBabylon(win.BABYLON);
    return Promise.resolve(win.BABYLON);
  }

  return new Promise((resolve, reject) => {
    const done = () => {
      if (!win.BABYLON) {
        reject(new Error("Babylon loaded without global API"));
        return;
      }
      patchBabylon(win.BABYLON);
      resolve(win.BABYLON);
    };

    const prior = document.querySelector<HTMLScriptElement>("script[data-pisipouk-babylon]");
    if (prior) {
      prior.addEventListener("load", done, { once: true });
      prior.addEventListener("error", () => reject(new Error("Babylon load failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.babylonjs.com/babylon.js";
    script.async = true;
    script.dataset.pisipoukBabylon = "1";
    script.addEventListener("load", done, { once: true });
    script.addEventListener("error", () => reject(new Error("Babylon load failed")), { once: true });
    document.head.appendChild(script);
  });
}

export function PreschoolV12Runtime() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let live = true;
    ensureBabylon()
      .then(() => live && setReady(true))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  if (failed) {
    return (
      <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: 24, background: "#eef9ff", color: "#17205b", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 64 }}>🧸</div>
          <h1>Ο Πισιπούκ δεν μπόρεσε να ανοίξει τα 3D παιχνίδια</h1>
          <p>Έλεγξε τη σύνδεση και ανανέωσε τη σελίδα.</p>
          <button onClick={() => location.reload()} style={{ border: 0, borderRadius: 16, padding: "12px 18px", fontWeight: 900, background: "#6848e8", color: "white" }}>Δοκιμάζω ξανά</button>
        </div>
      </main>
    );
  }

  if (!ready) {
    return (
      <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", background: "linear-gradient(180deg,#e6f8ff,#fff8df)", color: "#17205b" }} aria-label="Φόρτωση 3D παιχνιδιών">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 72, animation: "pisipoukLoad 1.6s ease-in-out infinite" }}>🧸</div>
          <b>Ο Πισιπούκ ετοιμάζει τα παιχνίδια…</b>
          <style>{`@keyframes pisipoukLoad{50%{transform:translateY(-8px) scale(1.04)}}`}</style>
        </div>
      </main>
    );
  }

  return <PreschoolGamesV13 />;
}
