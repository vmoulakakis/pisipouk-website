import { useState } from "react";
import { ExternalLink, Share2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { trackEvent } from "@/lib/pisipoukApi";

const FACEBOOK_PHOTOS_URL = "https://www.facebook.com/profile.php?id=100057124223027&sk=photos";

export function SocialShareBar() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const cleanUrl = () => {
    if (typeof window === "undefined") return "https://pisipouk.vercel.app";
    return window.location.origin + window.location.pathname;
  };

  const trackedUrl = (source: string) => {
    const url = new URL(cleanUrl());
    url.searchParams.set("utm_source", source);
    url.searchParams.set("utm_medium", "social_share");
    url.searchParams.set("utm_campaign", "pisipouk_page_share");
    return url.toString();
  };

  const nativeShare = async (source: string) => {
    const url = trackedUrl(source);
    await trackEvent("share_click", { placement: "global_social_bar", source });
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        text:
          lang === "gr"
            ? "Δείτε αυτή τη σελίδα από τον Πισιπούκ."
            : "See this page from Pisipouk.",
        url,
      }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const facebookShare = async () => {
    const url = trackedUrl("facebook");
    await trackEvent("share_click", {
      placement: "global_social_bar",
      source: "facebook",
    });
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer,width=700,height=650",
    );
  };

  return (
    <section className="border-t border-border/60 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[1.6rem] border bg-gradient-to-r from-amber-50 via-white to-sky-50 p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-[#0b3b82]">
              {lang === "gr" ? "Μοιραστείτε αυτή τη σελίδα" : "Share this page"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {lang === "gr"
                ? "Facebook άμεσα · Instagram, TikTok, Story/Reel μέσω του share menu του κινητού."
                : "Facebook directly · Instagram, TikTok and Story/Reel through your phone share menu."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={facebookShare}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-sm font-black text-white shadow-sm transition-transform hover:-translate-y-0.5"
              aria-label={lang === "gr" ? "Κοινοποίηση στο Facebook" : "Share on Facebook"}
            >
              <span className="text-base font-black">f</span>
              Facebook
            </button>

            <button
              type="button"
              onClick={() => nativeShare("instagram")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] px-4 py-2 text-sm font-black text-white shadow-sm transition-transform hover:-translate-y-0.5"
              aria-label={lang === "gr" ? "Κοινοποίηση στο Instagram" : "Share to Instagram"}
            >
              <span className="text-base">◎</span>
              Instagram
            </button>

            <button
              type="button"
              onClick={() => nativeShare("tiktok")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-black text-white shadow-sm transition-transform hover:-translate-y-0.5"
              aria-label={lang === "gr" ? "Κοινοποίηση στο TikTok" : "Share to TikTok"}
            >
              <span className="text-base">♪</span>
              TikTok
            </button>

            <button
              type="button"
              onClick={() => nativeShare("story_reel")}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-black text-[#0b3b82] shadow-sm transition-transform hover:-translate-y-0.5"
            >
              <Share2 className="h-4 w-4" />
              {lang === "gr" ? "Story / Reel" : "Story / Reel"}
            </button>

            <a
              href={FACEBOOK_PHOTOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("social_click", {
                  placement: "global_social_bar",
                  network: "facebook_photos",
                })
              }
              className="inline-flex min-h-11 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-black text-foreground transition-colors hover:bg-accent"
            >
              {lang === "gr" ? "Φωτογραφίες Facebook" : "Facebook photos"}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {copied && (
          <p className="mt-2 text-center text-xs font-bold text-emerald-700">
            {lang === "gr"
              ? "Ο σύνδεσμος αντιγράφηκε — επικολλήστε τον στο social app."
              : "Link copied — paste it into your social app."}
          </p>
        )}
      </div>
    </section>
  );
}
