import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { Chatbot } from "../chatbot/Chatbot";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/pisipoukApi";

export function SiteLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();

  useEffect(() => {
    trackEvent("page_view", { title: document.title });
  }, [loc.pathname, loc.search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <StickyMobileCTA />
      <Chatbot />
    </div>
  );
}
