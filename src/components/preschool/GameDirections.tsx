import { useEffect, useRef } from "react";
import { Hand, Volume2 } from "lucide-react";
import cues from "./guide-cues.json";
import audioIndex from "./guide-audio.json";
import "./game-directions.css";

export type GuideCue = keyof typeof cues;
export const guideText = cues;
const clips: Record<GuideCue, number[]> = audioIndex;

export function useGuideAudio() {
  const player = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const request = useRef(0);

  function stop() {
    request.current++;
    if (timer.current !== undefined) window.clearInterval(timer.current);
    timer.current = undefined;
    player.current?.pause();
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  useEffect(() => () => {
    request.current++;
    if (timer.current !== undefined) window.clearInterval(timer.current);
    player.current?.pause();
    window.speechSynthesis?.cancel();
  }, []);

  function play(cue: GuideCue) {
    stop();
    const currentRequest = request.current;
    const fallback = () => {
      if (currentRequest !== request.current || !window.speechSynthesis || typeof SpeechSynthesisUtterance === "undefined") return;
      if (timer.current !== undefined) window.clearInterval(timer.current);
      timer.current = undefined;
      const line = new SpeechSynthesisUtterance(cues[cue]);
      line.lang = "el-GR";
      line.rate = .87;
      window.speechSynthesis.speak(line);
    };
    const clip = clips[cue];
    if (!clip) { fallback(); return; }
    try {
      player.current ??= new Audio("/preschool-world/pisipouk-guide.mp3");
      const audio = player.current;
      audio.volume = .85;
      audio.currentTime = clip[0];
      timer.current = window.setInterval(() => {
        if (audio.currentTime >= clip[1] || audio.ended) stop();
      }, 35);
      void audio.play().catch(() => fallback());
    } catch {
      fallback();
    }
  }

  return { play, stop };
}

export function GameDirections({ text, listen, show }: {
  text: string;
  listen: () => void;
  show?: () => void;
}) {
  return (
    <div className="ps-game-directions">
      <p>{text}</p>
      <div className="ps-game-direction-actions">
        <button type="button" onClick={listen}><Volume2 aria-hidden="true" /> Άκου τι να κάνεις</button>
        {show && <button type="button" onClick={show}><Hand aria-hidden="true" /> Δείξε μου πώς</button>}
      </div>
    </div>
  );
}
