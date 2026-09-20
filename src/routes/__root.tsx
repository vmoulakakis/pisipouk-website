import { Outlet, createRootRoute } from "@tanstack/react-router";
import { useEffect } from "react";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { primeSessionCache } from "@/lib/auth-cache";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Δεν βρέθηκε / Not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Η σελίδα που ψάχνετε δεν υπάρχει. / The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Αρχική / Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Παιδικός Σταθμός - Νηπιαγωγείο Ο Πισιπούκ | Ασφάλεια, Αγάπη και Δημιουργία" },
      {
        name: "description",
        content:
          "Ο Πισιπούκ είναι ένας ζεστός παιδικός σταθμός - νηπιαγωγείο με ασφαλές περιβάλλον, δημιουργική μάθηση και καθημερινή φροντίδα για κάθε παιδί.",
      },
      { name: "author", content: "Ο Πισιπούκ" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Παιδικός Σταθμός - Νηπιαγωγείο Ο Πισιπούκ | Ασφάλεια, Αγάπη και Δημιουργία" },
      { name: "twitter:title", content: "Παιδικός Σταθμός - Νηπιαγωγείο Ο Πισιπούκ | Ασφάλεια, Αγάπη και Δημιουργία" },
      { name: "description", content: "A bilingual web app for a preschool/kindergarten, offering a public site, admin tools, parent portal, and AI assistance." },
      { property: "og:description", content: "A bilingual web app for a preschool/kindergarten, offering a public site, admin tools, parent portal, and AI assistance." },
      { name: "twitter:description", content: "A bilingual web app for a preschool/kindergarten, offering a public site, admin tools, parent portal, and AI assistance." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c777e7b-a660-4220-a642-38fc8491d015/id-preview-91e5db08--36c3be08-d17a-4695-849a-8d3e8f005c38.lovable.app-1776841840428.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c777e7b-a660-4220-a642-38fc8491d015/id-preview-91e5db08--36c3be08-d17a-4695-849a-8d3e8f005c38.lovable.app-1776841840428.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  useEffect(() => {
    if (typeof window === "undefined" || !isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      primeSessionCache(data.session ?? null);
    });

    const hash = window.location.hash;
    if (hash && hash.includes("access_token=")) {
      supabase.auth.getSession().finally(() => {
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState({}, document.title, cleanUrl);
      });
    }
  }, []);

  return (
    <LanguageProvider>
      <Outlet />
    </LanguageProvider>
  );
}