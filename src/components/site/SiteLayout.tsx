import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { Chatbot } from "../chatbot/Chatbot";
import { SocialShareBar } from "./SocialShareBar";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { BookOpen, CalendarDays, Gamepad2, Home, LockKeyhole, Palette, PersonStanding, Users } from "lucide-react";
import {
  excludeThisBrowserFromAnalytics,
  includeThisBrowserInAnalytics,
  trackEvent,
} from "@/lib/pisipoukApi";

export function SiteLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const isPreschoolKidWorld = loc.pathname === "/virtual-preschool";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const analyticsMode = params.get("analytics");

    if (analyticsMode === "off") {
      void excludeThisBrowserFromAnalytics();
      return;
    }

    if (analyticsMode === "on") {
      includeThisBrowserInAnalytics();
    }

    trackEvent("page_view", { title: document.title });
  }, [loc.pathname, loc.search]);

  if (isPreschoolKidWorld) {
    return (
      <div className="preschool-kid-shell min-h-screen">
        <header className="preschool-kid-chrome" aria-label="Κύρια πλοήγηση Virtual Preschool">
          <a href="/virtual-preschool" className="preschool-kid-logo" aria-label="Αρχική Virtual Preschool">
            <span className="preschool-kid-mascot" aria-hidden="true">⭐</span>
            <span><b>PISIPOUK</b><small>VIRTUAL PRESCHOOL+</small></span>
          </a>

          <nav className="preschool-kid-nav" aria-label="Δραστηριότητες">
            <a href="/virtual-preschool" className="is-active"><Home /><span>Αρχική</span></a>
            <a href="#games"><Gamepad2 /><span>Παιχνίδια</span></a>
            <a href="#watch"><BookOpen /><span>Ιστορίες</span></a>
            <a href="#create"><Palette /><span>Δημιουργώ</span></a>
            <a href="#today"><PersonStanding /><span>Κινούμαι</span></a>
            <a href="/parent-zone"><Users /><span>Για Γονείς</span></a>
          </nav>

          <div className="preschool-kid-actions">
            <a href="#calendar" className="preschool-today"><CalendarDays /><span>Σήμερα</span><i /></a>
            <a href="/parent-zone" className="preschool-parent-gate"><LockKeyhole /><span>Είσοδος Γονέων</span></a>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <SocialShareBar />
      <Footer />
      <StickyMobileCTA />
      <Chatbot />
    </div>
  );
}
