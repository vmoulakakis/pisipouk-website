import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { Chatbot } from "../chatbot/Chatbot";
import { SocialShareBar } from "./SocialShareBar";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { PreschoolV7 } from "@/components/preschool/PreschoolV7";
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
    return <PreschoolV7 />;
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
