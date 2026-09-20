import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

const NAV_LINKS = [
  { to: "/", key: "home" as const },
  { to: "/about", key: "about" as const },
  { to: "/program", key: "program" as const },
  { to: "/daily-life", key: "daily" as const },
  { to: "/safety-care", key: "safety" as const },
  { to: "/gallery", key: "gallery" as const },
  { to: "/blog", key: "blog" as const },
  { to: "/faq", key: "faq" as const },
  { to: "/contact", key: "contact" as const },
];

export function Header() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthed(false);
      setIsAdmin(false);
      return;
    }

    const refresh = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      setAuthed(!!uid);
      if (uid) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      } else {
        setIsAdmin(false);
      }
    };

    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg leading-tight">
            <span className="block">Ο Πισιπούκ</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => {
            const active = loc.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  active && "bg-accent text-accent-foreground",
                )}
              >
                {dict.nav[l.key][lang]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-border bg-muted/40 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLang("gr")}
              aria-pressed={lang === "gr"}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                lang === "gr" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Ελληνικά
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={cn(
                "rounded-full px-3 py-1 transition-colors",
                lang === "en" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              English
            </button>
          </div>

          {isAdmin && (
            <Button asChild size="sm" variant="outline" className="hidden rounded-full md:inline-flex">
              <Link to="/admin"><ShieldCheck className="h-4 w-4" /> Admin</Link>
            </Button>
          )}
          {authed ? (
            <Button size="sm" variant="ghost" className="hidden rounded-full md:inline-flex" onClick={() => supabase.auth.signOut()}>
              <LogOut className="h-4 w-4" /> {dict.cta.logout[lang]}
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost" className="hidden rounded-full md:inline-flex">
              <Link to="/login"><LogIn className="h-4 w-4" /> {dict.cta.login[lang]}</Link>
            </Button>
          )}

          <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
            <Link to="/enrollment">{dict.cta.book[lang]}</Link>
          </Button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? dict.chat.close[lang] : "Menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="container mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-accent"
              >
                {dict.nav[l.key][lang]}
              </Link>
            ))}
            <Link to="/portal" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-accent">
              {dict.nav.portal[lang]}
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-accent">
                Admin
              </Link>
            )}
            {authed ? (
              <button onClick={() => { supabase.auth.signOut(); setOpen(false); }} className="rounded-2xl px-4 py-3 text-left text-base font-medium hover:bg-accent">
                {dict.cta.logout[lang]}
              </button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-base font-medium hover:bg-accent">
                {dict.cta.login[lang]}
              </Link>
            )}
            <Button asChild size="lg" className="mt-2 rounded-full">
              <Link to="/enrollment" onClick={() => setOpen(false)}>{dict.cta.book[lang]}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}