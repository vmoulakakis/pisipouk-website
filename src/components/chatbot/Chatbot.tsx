import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

export function Chatbot() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const sessionRef = useRef<string>(
    typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2),
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset greeting when language changes / on first open
  useEffect(() => {
    setMessages([{ role: "assistant", content: dict.chat.greeting[lang] }]);
  }, [lang]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages([...next, { role: "assistant", content: "" }]);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          language: lang,
          sessionId: sessionRef.current,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errText = resp.status === 429
          ? (lang === "gr" ? "Πολλά αιτήματα, δοκιμάστε σε λίγο." : "Too many requests, try again shortly.")
          : dict.chat.fallback[lang];
        setMessages((prev) => {
          const arr = [...prev];
          arr[arr.length - 1] = { role: "assistant", content: errText };
          return arr;
        });
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages((prev) => {
                const arr = [...prev];
                arr[arr.length - 1] = { role: "assistant", content: acc };
                return arr;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      if (!acc.trim()) {
        setMessages((prev) => {
          const arr = [...prev];
          arr[arr.length - 1] = { role: "assistant", content: dict.chat.fallback[lang] };
          return arr;
        });
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => {
        const arr = [...prev];
        arr[arr.length - 1] = { role: "assistant", content: dict.chat.fallback[lang] };
        return arr;
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={dict.chat.open[lang]}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 md:bottom-6"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div
          className={cn(
            "fixed inset-x-3 bottom-3 z-50 flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl",
            "md:inset-auto md:bottom-6 md:right-6 md:h-[36rem] md:w-[24rem]",
          )}
        >
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{dict.chat.name[lang]}</p>
                <p className="text-xs opacity-80">{lang === "gr" ? "Συνήθως απαντάμε άμεσα" : "We usually reply instantly"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={dict.chat.close[lang]} className="rounded-full p-1 hover:bg-primary-foreground/20">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 px-3 py-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm",
                    m.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-card text-card-foreground",
                  )}
                >
                  {m.content || (busy ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-border bg-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.chat.placeholder[lang]}
              className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={dict.chat.placeholder[lang]}
              maxLength={1000}
            />
            <Button type="submit" size="icon" className="h-10 w-10 rounded-full" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}