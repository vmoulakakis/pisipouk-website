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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main key={loc.pathname} className="pisipouk-route-enter flex-1 pb-24 md:pb-0">{children}</main>
      <SocialShareBar />
      <Footer />
      <StickyMobileCTA />
      <Chatbot />
    </div>
  );
}
