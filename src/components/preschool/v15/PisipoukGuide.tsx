import { Volume2 } from "lucide-react";
import bearLogo from "@/assets/pisipouk-logo.webp";

export function speakGreek(text: string) {
  try {
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "el-GR";
    u.rate = 0.88;
    u.pitch = 1.05;
    window.speechSynthesis?.speak(u);
  } catch {
    // Audio guidance is progressive enhancement.
  }
}

export function PisipoukGuide({
  message,
  mood = "idle",
  necklace,
}: {
  message: string;
  mood?: "idle" | "happy" | "think" | "dance" | "eat";
  necklace?: string[];
}) {
  return (
    <aside className={`pv15-guide mood-${mood}`}>
      <div className="pv15-guide-character">
        <img src={bearLogo} alt="Ο Πισιπούκ το αρκουδάκι" />
        {necklace?.length ? (
          <div className="pv15-worn-necklace" aria-label="Το κολιέ που έφτιαξε το παιδί">
            {necklace.map((color, index) => (
              <i key={`${color}-${index}`} style={{ background: color }} />
            ))}
          </div>
        ) : null}
      </div>
      <div className="pv15-guide-bubble" aria-live="polite">
        <b>Πισιπούκ</b>
        <span>{message}</span>
        <button onClick={() => speakGreek(message)} aria-label="Άκου την οδηγία">
          <Volume2 size={18} />
        </button>
      </div>
    </aside>
  );
}
