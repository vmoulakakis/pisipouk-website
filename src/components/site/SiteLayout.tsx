import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCTA } from "./StickyMobileCTA";
import { Chatbot } from "../chatbot/Chatbot";
import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
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