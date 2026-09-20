import { HeadContent, Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

import { LanguageProvider } from "@/i18n/LanguageProvider";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { primeSessionCache } from "@/lib/auth-cache";

const PRIMARY_ORIGIN = "https://pisipouk.vercel.app";

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
      { title: "Ο Πισιπούκ | Παιδικός Σταθμός & Νηπιαγωγείο στον Άγιο Δημήτριο" },
      {
        name: "description",
        content:
          "Ο Πισιπούκ είναι παιδικός σταθμός και νηπιαγωγείο στον Άγιο Δημήτριο για παιδιά 2,5–6 ετών, με δημιουργική μάθηση, φροντίδα και ολοήμερο πρόγραμμα.",
      },
      { name: "author", content: "Ο Πισιπούκ" },
      { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Ο Πισιπούκ" },
      { property: "og:locale", content: "el_GR" },
      { property: "og:title", content: "Ο Πισιπούκ | Παιδικός Σταθμός & Νηπιαγωγείο στον Άγιο Δημήτριο" },
      { property: "og:description", content: "Ένα ζεστό και ασφαλές σχολείο για παιδιά 2,5–6 ετών στον Άγιο Δημήτριο. Γνωρίστε τον χώρο, το πρόγραμμα και την ομάδα μας." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c777e7b-a660-4220-a642-38fc8491d015/id-preview-91e5db08--36c3be08-d17a-4695-849a-8d3e8f005c38.lovable.app-1776841840428.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ο Πισιπούκ | Παιδικός Σταθμός & Νηπιαγωγείο στον Άγιο Δημήτριο" },
      { name: "twitter:description", content: "Παιδικός σταθμός και νηπιαγωγείο στον Άγιο Δημήτριο για παιδιά 2,5–6 ετών." },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9c777e7b-a660-4220-a642-38fc8491d015/id-preview-91e5db08--36c3be08-d17a-4695-849a-8d3e8f005c38.lovable.app-1776841840428.png" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const normalizedPath =
      location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    const canonicalUrl = `${PRIMARY_ORIGIN}${normalizedPath}`;

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = canonicalUrl;
  }, [location.pathname]);

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
      <HeadContent />
      <Outlet />
    </LanguageProvider>
  );
}
