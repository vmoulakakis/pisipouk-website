import { useEffect, useRef, useState } from "react";
import { speak } from "../world/Game";
import type { PreschoolAge } from "./curriculum";
import "./daily-episode.css";

const episodes = [
  { title: "Το φαναράκι που ξέχασε να λάμπει", format: "Παραμύθι", kind: "story", icon: "🏮" },
  { title: "Τα γράμματα του δάσους", format: "Παιχνίδι", kind: "match", icon: "✉️" },
  { title: "Πατούσα, παλαμάκι!", format: "Μουσική και κίνηση", kind: "music", icon: "🎵" },
  { title: "Το μυστικό θέατρο σκιών", format: "Happening", kind: "theatre", icon: "🌙" },
] as const;

const paths = [
  { name: "Το ρυάκι", icon: "💧", hint: "Το ρυάκι γουργουρίζει. Ο Πισιπούκ βρήκε μια γαλάζια πέτρα που φωτίζει το νερό." },
  { name: "Η κουκουβάγια", icon: "🦉", hint: "Η κουκουβάγια τού δείχνει την πορτοκαλιά αχτίδα που έμεινε πάνω στα φύλλα." },
  { name: "Η φωλιά", icon: "🪶", hint: "Στη φωλιά βρήκε ένα φτερό. Το σηκώνει κι ο αέρας τού δείχνει τον δρόμο." },
];
const letters = [
  { name: "Φύλλο", icon: "🍃" },
  { name: "Αστέρι", icon: "⭐" },
  { name: "Λουλούδι", icon: "🌼" },
  { name: "Φεγγάρι", icon: "🌙" },
];
const lyrics = "Μια πατούσα πάει μπροστά, δυο παλαμάκια δυνατά. Κι όταν κάνω σσσ εγώ, γίνομαι αρκουδάκι ακίνητο!";
const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 0, 392, 440, 392, 329.63, 293.66, 329.63, 261.63];

function athensDay() {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Europe/Athens", year: "numeric", month: "numeric", day: "numeric",
  }).formatToParts(new Date());
  const read = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return Date.UTC(read("year"), read("month") - 1, read("day")) / 86_400_000;
}

export function DailyEpisode({ age }: { age: PreschoolAge }) {
  const [day, setDay] = useState<number>();
  const [selection, setSelection] = useState<number>();
  useEffect(() => {
    const refresh = () => setDay(athensDay());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const today = (day ?? 0) % episodes.length;
  const chosen = selection ?? today;
  const episode = episodes[chosen];

  return (
    <section className="ps-episode" aria-labelledby="ps-episode-title">
      <div className="ps-episode-heading">
        <p>{selection === undefined ? "Η αποστολή της ημέρας" : "Η βιβλιοθήκη του Πισιπούκ"} · {episode.format}</p>
        <h2 id="ps-episode-title">{episode.title}</h2>
      </div>
      <EpisodeStage key={chosen + "-" + age} kind={episode.kind} age={age} />
      <nav className="ps-episode-library" aria-label="Επεισόδια με τον Πισιπούκ">
        <button type="button" aria-pressed={selection === undefined} onClick={() => setSelection(undefined)}>Σήμερα</button>
        {episodes.map((item, index) => (
          <button type="button" key={item.kind} aria-pressed={selection === index} onClick={() => setSelection(index)}>
            <span aria-hidden="true">{item.icon} </span>{item.format}
          </button>
        ))}
      </nav>
      <aside className="ps-episode-parent">
        <h3>Για γονείς</h3>
        <p>Δώστε χρόνο στο παιδί να διαλέξει. Μετά το παιχνίδι, ζητήστε του να δείξει με μια κίνηση ή μια εικόνα τι ανακάλυψε.</p>
        <a href="/book-visit">Γνωρίστε την ομάδα του Πισιπούκ στον Άγιο Δημήτριο</a>
      </aside>
    </section>
  );
}

function EpisodeStage({ kind, age }: { kind: typeof episodes[number]["kind"]; age: PreschoolAge }) {
  const [opened, setOpened] = useState<number[]>([]);
  const [ending, setEnding] = useState<number>();
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dancing, setDancing] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const timers = useRef<number[]>([]);
  const playback = useRef(0);
  useEffect(() => () => {
    playback.current++;
    timers.current.forEach(window.clearTimeout);
    void audio.current?.close().catch(() => {});
    window.speechSynthesis?.cancel();
  }, []);

  const narrate = (line: string) => speak(line, setFeedback);
  const stopMusic = () => {
    playback.current++;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    void audio.current?.close().catch(() => {});
    audio.current = null;
    setDancing(false);
  };
  const playMusic = async () => {
    stopMusic();
    setFeedback("");
    window.speechSynthesis?.cancel();
    const attempt = playback.current;
    try {
      const context = new AudioContext();
      audio.current = context;
      await context.resume();
      if (playback.current !== attempt) return;
      const beat = 0.44;
      const start = context.currentTime + 0.03;
      notes.forEach((frequency, index) => {
        if (!frequency) return;
        const oscillator = context.createOscillator();
        const volume = context.createGain();
        const time = start + index * beat;
        oscillator.frequency.value = frequency;
        volume.gain.setValueAtTime(0.075, time);
        volume.gain.exponentialRampToValueAtTime(0.001, time + 0.33);
        oscillator.connect(volume).connect(context.destination);
        oscillator.start(time);
        oscillator.stop(time + 0.34);
      });
      setDancing(true);
      timers.current = [
        window.setTimeout(() => setDancing(false), 7 * beat * 1000),
        window.setTimeout(() => setDancing(true), 8 * beat * 1000),
        window.setTimeout(stopMusic, notes.length * beat * 1000 + 80),
      ];
    } catch {
      stopMusic();
      setFeedback("Η μελωδία δεν ξεκίνησε. Δοκίμασε ξανά ή παίξε με παλαμάκια.");
    }
  };
  const introduction = "Ο Πισιπούκ βρήκε ένα σβηστό φαναράκι. Ποιος μπορεί να τον βοηθήσει να το ανάψει;";
  const available = age < 2 ? 2 : 3;
  const detail = ending === 0
    ? "Στο ρυάκι, το φαναράκι άναψε γαλάζιο. Ο Πισιπούκ έδειξε τον δρόμο στα ζωάκια που γύριζαν σπίτι."
    : "Στο δέντρο, το φαναράκι άναψε χρυσαφί. Ο Πισιπούκ κάλεσε τους φίλους του να κοιτάξουν μαζί τ’ αστέρια.";
  const matchChoices = letters.slice(0, age + 2);
  const roundCount = Math.min(matchChoices.length, 3);
  const order = [...matchChoices.slice(1), matchChoices[0]];
  const required = age >= 2 ? 2 : 1;
  const explore = (index: number) => {
    setOpened((previous) => [...previous.filter((item) => item !== index), index]);
    setFeedback("");
  };
  const reset = () => {
    window.speechSynthesis?.cancel();
    setOpened([]);
    setEnding(undefined);
    setRound(0);
    setFeedback("");
  };

  return (
    <div className={`ps-episode-stage ps-episode-${kind}`}>
      <div className="ps-episode-art">
        <img className="ps-episode-bear" src="/preschool-world/bear.webp" alt="Ο Πισιπούκ" />
        <span aria-hidden="true">{kind === "story" ? "🏮" : kind === "match" ? "✉️" : kind === "music" ? "♫" : "☾"}</span>
      </div>
      <div className="ps-episode-play">
        {kind === "story" && (
          <>
            <p>{ending === undefined ? introduction : detail}</p>
            <button type="button" onClick={() => narrate(ending === undefined ? introduction : detail)}>Άκου τον Πισιπούκ</button>
            {ending === undefined && <div className="ps-episode-options" aria-label="Σημεία εξερεύνησης">
              {paths.slice(0, available).map((path, index) => (
                <button type="button" key={path.name} aria-pressed={opened.at(-1) === index} onClick={() => explore(index)}>
                  <span aria-hidden="true">{path.icon}</span>{path.name}
                </button>
              ))}
            </div>}
            {ending === undefined && opened.length > 0 && (
              <>
                <p role="status">{paths[opened[opened.length - 1]].hint}</p>
                <button type="button" onClick={() => narrate(paths[opened[opened.length - 1]].hint)}>Άκου το στοιχείο</button>
              </>
            )}
            {ending === undefined && opened.length >= required && (
              <div className="ps-episode-options" aria-label="Διάλεξε το τέλος">
                {age >= 2 && <button type="button" onClick={() => { window.speechSynthesis?.cancel(); setEnding(0); }}>Ανάβουμε στο ρυάκι</button>}
                <button type="button" onClick={() => { window.speechSynthesis?.cancel(); setEnding(1); }}>{age >= 2 ? "Ανάβουμε στο δέντρο" : "Ανάβουμε το φαναράκι"}</button>
              </div>
            )}
            {ending !== undefined && <div className="ps-episode-options">
              <button type="button" onClick={reset}>Πάλι από την αρχή</button>
              <a className="ps-episode-download" href="/preschool-world/lantern-pattern.svg" download>Ζωγράφισε το φαναράκι · Α4</a>
            </div>}
          </>
        )}
        {kind === "match" && (round === roundCount ? (
          <><p role="status">Ο Πισιπούκ παρέδωσε όλα τα γράμματα!</p><button type="button" onClick={reset}>Παίζουμε ξανά</button></>
        ) : (
          <>
            <p>Σε ποιο σπίτι πάει το γράμμα με το σημάδι «{matchChoices[round].name}»; <span aria-hidden="true">{matchChoices[round].icon}</span></p>
            <div className="ps-episode-options">
              {order.map((letter) => (
                <button type="button" key={letter.name} onClick={() => {
                  if (letter === matchChoices[round]) {
                    setFeedback("Ωραία, το γράμμα βρήκε το σπίτι του!");
                    setRound(round + 1);
                  } else {
                    setFeedback("Κοίτα ξανά το σημάδι στο γράμμα.");
                  }
                }}><span aria-hidden="true">🏡 {letter.icon}</span>{letter.name}</button>
              ))}
            </div>
          </>
        ))}
        {kind === "music" && (
          <>
            <p>{lyrics}</p>
            <p className="ps-episode-beat" role="status">{dancing ? "Χορεύουμε!" : "Μένουμε ακίνητοι!"}</p>
            <div className="ps-episode-options">
              <button type="button" onClick={() => void playMusic()}>Παίξε τη μελωδία</button>
              <button type="button" onClick={stopMusic}>Σταμάτα τη μουσική</button>
            </div>
          </>
        )}
        {kind === "theatre" && (
          <>
            <p>Διάλεξε ποιος θα μπει στη σκηνή με τον Πισιπούκ.</p>
            <div className="ps-episode-options">
              {paths.slice(0, available).map((path, index) => (
                <button type="button" key={path.name} aria-pressed={opened.at(-1) === index} onClick={() => explore(index)}>
                  <span aria-hidden="true">{path.icon}</span>{path.name}
                </button>
              ))}
            </div>
            {opened.length > 0 && <p role="status">{paths[opened[opened.length - 1]].hint}</p>}
            <p>Με έναν μεγάλο, ζωγράφισε τη φιγούρα στο πατρόν. Φώτισε το χαρτί με φακό και δοκίμασε να αλλάξεις το μέγεθος της σκιάς.</p>
            <a className="ps-episode-download" href="/preschool-world/lantern-pattern.svg" download>Κατέβασε το πατρόν Α4</a>
          </>
        )}
        {feedback && <p role="status">{feedback}</p>}
      </div>
    </div>
  );
}
