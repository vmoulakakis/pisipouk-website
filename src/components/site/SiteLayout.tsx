import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { Chatbot } from "../chatbot/Chatbot";
import { SocialShareBar } from "./SocialShareBar";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
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
        <div className="preschool-kid-chrome" aria-label="Πλοήγηση παιδικού κόσμου">
          <a href="/" className="preschool-kid-home" aria-label="Επιστροφή στον Πισιπούκ">
            <span aria-hidden="true">←</span><span className="preschool-kid-home-label">Πισιπούκ</span><span aria-hidden="true">🦉</span>
          </a>
          <div className="preschool-kid-brand">Ο Κόσμος του Πισιπούκ</div>
          <a href="/parent-zone" className="preschool-kid-parent">🔒 <span>Γονείς</span></a>
        </div>
        <main className="min-h-screen pt-[68px]">{children}</main>
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
