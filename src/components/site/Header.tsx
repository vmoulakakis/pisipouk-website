import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/pisipouk-logo.webp";

const NAV_LINKS = [
  { to: "/", key: "home" as const },
  { to: "/about", key: "about" as const },
  { to: "/program", key: "program" as const },
  { to: "/daily-life", key: "daily" as const },
  { to: "/safety-care", key: "safety" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/faq", key: "faq" as const },
  { to: "/contact", key: "contact" as const },
];

export function Header() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <Link
        to="/espa-2026-2027"
        className="flex min-h-8 items-center justify-center gap-2 bg-foreground px-4 py-1.5 text-center text-xs font-bold text-background hover:bg-primary"
      >
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-sun"
          aria-hidden="true"
        />
        {lang === "gr"
          ? "Voucher ΕΕΤΑΑ / ΕΣΠΑ 2026–2027: επίσημη ενημέρωση γονέων"
          : "EETAA voucher 2026–2027: official parent update"}
      </Link>
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-black"
          aria-label={lang === "gr" ? "Πισιπούκ — Αρχική" : "Pisipouk — Home"}
        >
          <img
            src={logoImage}
            alt=""
            className="h-14 w-14 object-contain"
            aria-hidden="true"
          />
          <span className="text-lg leading-none">Ο Πισιπούκ</span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 xl:flex"
          aria-label={lang === "gr" ? "Κύρια πλοήγηση" : "Primary navigation"}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-bold transition-colors hover:bg-accent",
                loc.pathname === link.to && "bg-accent text-accent-foreground",
              )}
            >
              {dict.nav[link.key][lang]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border bg-white/60 p-1 text-xs font-bold sm:flex">
            <button
              type="button"
              onClick={() => setLang("gr")}
              aria-pressed={lang === "gr"}
              className={cn(
                "rounded-full px-2.5 py-1.5",
                lang === "gr" && "bg-foreground text-background",
              )}
            >
              ΕΛ
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={cn(
                "rounded-full px-2.5 py-1.5",
                lang === "en" && "bg-foreground text-background",
              )}
            >
              EN
            </button>
          </div>
          <Button
            asChild
            size="sm"
            className="hidden rounded-full md:inline-flex"
          >
            <Link to="/book-visit">{dict.cta.book[lang]}</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white/60 xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={
              open
                ? lang === "gr"
                  ? "Κλείσιμο μενού"
                  : "Close menu"
                : lang === "gr"
                  ? "Άνοιγμα μενού"
                  : "Open menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t bg-background xl:hidden"
        >
          <nav
            className="mx-auto grid max-w-7xl gap-1 px-4 py-4"
            aria-label={lang === "gr" ? "Μενού κινητού" : "Mobile menu"}
          >
            <div className="mb-2 flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setLang("gr")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-bold",
                  lang === "gr" && "bg-foreground text-background",
                )}
              >
                Ελληνικά
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-bold",
                  lang === "en" && "bg-foreground text-background",
                )}
              >
                English
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-2xl px-4 py-3 text-base font-bold hover:bg-accent"
              >
                {dict.nav[link.key][lang]}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-2 rounded-full">
              <Link to="/book-visit">{dict.cta.book[lang]}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
