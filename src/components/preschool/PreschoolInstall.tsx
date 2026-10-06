import { useEffect, useMemo, useState } from "react";
import { Download, Share2, Smartphone, X } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isStandalone() {
  return window.matchMedia?.("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
}

function platform() {
  const ua = navigator.userAgent.toLowerCase();
  const isiPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/.test(ua) || isiPadOS) return "ios" as const;
  if (/android/.test(ua)) return "android" as const;
  return "other" as const;
}

export function PreschoolInstall() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const os = useMemo(() => (typeof navigator === "undefined" ? "other" : platform()), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setInstalled(isStandalone());
    if (isStandalone()) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setOpen(false);
      trackEvent("preschool_pwa_installed", { platform: os });
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    navigator.serviceWorker?.register("/pisipouk-sw.js", { scope: "/virtual-preschool/" }).catch(() => undefined);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [os]);

  if (installed) return null;

  const install = async () => {
    trackEvent("preschool_pwa_install_open", { platform: os });
    if (os === "android" && deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      trackEvent("preschool_pwa_install_result", { platform: os, outcome: choice.outcome });
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <button className="pisipouk-install-fab" onClick={install} aria-label="Εγκατάσταση του Πισιπούκ στο κινητό">
        <Smartphone size={20} />
        <span>{os === "ios" ? "Στο iPhone / iPad" : "Εγκατάσταση"}</span>
      </button>
      {open && (
        <div className="pisipouk-install-sheet" role="dialog" aria-modal="true" aria-label="Εγκατάσταση Πισιπούκ">
          <button className="pisipouk-install-close" onClick={() => setOpen(false)} aria-label="Κλείσιμο"><X /></button>
          <div className="pisipouk-install-icon"><img src="/favicon.webp" alt="Πισιπούκ" /></div>
          <p className="eyebrow">Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ</p>
          <h2>Βάλε τον Πισιπούκ στην αρχική οθόνη</h2>
          {os === "ios" ? (
            <div className="pisipouk-install-steps">
              <p><span>1</span><Share2 /> Πάτησε <b>Κοινοποίηση</b> στο Safari.</p>
              <p><span>2</span><Download /> Διάλεξε <b>Προσθήκη στην οθόνη Αφετηρίας</b>.</p>
              <p><span>3</span>⭐ Άνοιγέ τον μετά σαν κανονική εφαρμογή, χωρίς browser chrome.</p>
            </div>
          ) : (
            <div className="pisipouk-install-steps">
              <p><span>1</span><Download /> Άνοιξε το μενού του browser.</p>
              <p><span>2</span>📲 Διάλεξε <b>Εγκατάσταση εφαρμογής</b> ή <b>Προσθήκη στην αρχική οθόνη</b>.</p>
              <p><span>3</span>⭐ Ο Πισιπούκ θα εμφανιστεί μαζί με τις εφαρμογές σου.</p>
            </div>
          )}
          <small>Δεν απαιτείται λογαριασμός παιδιού. Η πρόοδος παραμένει τοπικά στη συσκευή.</small>
        </div>
      )}
      <style>{`
        .pisipouk-install-fab{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,calc(env(safe-area-inset-bottom) + 12px));z-index:260;border:0;border-radius:999px;background:linear-gradient(135deg,#5f3ee9,#8a54f5);color:white;box-shadow:0 16px 38px rgba(72,51,180,.34);padding:12px 17px;display:flex;align-items:center;gap:8px;font-weight:950;cursor:pointer}.pisipouk-install-sheet{position:fixed;z-index:400;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(520px,calc(100% - 20px));border-radius:30px;background:rgba(255,255,255,.98);box-shadow:0 28px 90px rgba(31,40,87,.34);padding:24px;color:#14215a}.pisipouk-install-close{position:absolute;right:14px;top:14px;border:0;border-radius:50%;width:40px;height:40px;display:grid;place-items:center;background:#f1efff;color:#6048dc}.pisipouk-install-icon{width:86px;height:86px;border-radius:24px;overflow:hidden;box-shadow:0 12px 28px rgba(54,71,130,.18);margin-bottom:12px}.pisipouk-install-icon img{width:100%;height:100%;object-fit:cover}.pisipouk-install-sheet .eyebrow{font-size:.7rem;letter-spacing:.11em;font-weight:1000;color:#6d51ec;margin:0 0 6px}.pisipouk-install-sheet h2{font-size:1.55rem;line-height:1.05;margin:0 44px 16px 0}.pisipouk-install-steps{display:grid;gap:9px}.pisipouk-install-steps p{margin:0;display:flex;align-items:center;gap:9px;font-weight:800;line-height:1.35;background:#f7f8ff;border-radius:16px;padding:11px 12px}.pisipouk-install-steps p span{flex:0 0 26px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#ffd84f;color:#443d10;font-weight:1000}.pisipouk-install-steps svg{width:20px}.pisipouk-install-sheet small{display:block;margin-top:14px;color:#6a7392;line-height:1.45}@media(min-width:900px){.pisipouk-install-fab{bottom:20px}}@media(max-width:720px){.pisipouk-install-fab{bottom:max(82px,calc(env(safe-area-inset-bottom) + 78px));padding:11px 14px}.pisipouk-install-fab span{font-size:.75rem}.pisipouk-install-sheet{bottom:max(8px,env(safe-area-inset-bottom));border-radius:28px 28px 24px 24px}}
      `}</style>
    </>
  );
}
