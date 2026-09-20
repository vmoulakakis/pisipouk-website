import { useLanguage } from "@/i18n/LanguageProvider";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";

export function StickyMobileCTA() {
  const { lang } = useLanguage();

  return (
    <div
      className="fixed inset-x-3 z-50 md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
      aria-label={lang === "gr" ? "Γρήγορη επικοινωνία" : "Quick contact"}
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2 rounded-[1.4rem] border border-border/70 bg-background/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,.20)] backdrop-blur-xl">
        <a
          onClick={() => trackEvent("phone_click", { placement: "mobile_floating_dock" })}
          href="tel:+302109756277"
          className="flex min-h-[62px] flex-col items-center justify-center rounded-[1rem] bg-primary px-2 text-center text-[11px] font-black leading-tight text-primary-foreground active:scale-[.98]"
          aria-label={lang === "gr" ? "Καλέστε τώρα στο 210 975 6277" : "Call now"}
        >
          <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <Phone className="h-5 w-5" />
          </span>
          {lang === "gr" ? "Κλήση τώρα" : "Call now"}
        </a>

        <a
          onClick={() => trackEvent("email_click", { placement: "mobile_floating_dock" })}
          href="mailto:pisipouk@windowslive.com?subject=Επικοινωνία%20από%20το%20site%20Πισιπούκ"
          className="flex min-h-[62px] flex-col items-center justify-center rounded-[1rem] bg-card px-2 text-center text-[11px] font-black leading-tight ring-1 ring-border active:scale-[.98]"
          aria-label={lang === "gr" ? "Στείλτε email στον Πισιπούκ" : "Email Pisipouk"}
        >
          <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
            <Mail className="h-5 w-5" />
          </span>
          {lang === "gr" ? "Email" : "Email"}
        </a>

        <a
          onClick={() => trackEvent("viber_click", { placement: "mobile_floating_dock" })}
          href="viber://contact?number=%2B302109756277"
          className="flex min-h-[62px] flex-col items-center justify-center rounded-[1rem] bg-secondary px-2 text-center text-[11px] font-black leading-tight text-secondary-foreground active:scale-[.98]"
          aria-label={lang === "gr" ? "Ανοίξτε συνομιλία Viber" : "Open Viber"}
        >
          <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-background/70">
            <MessageCircle className="h-5 w-5" />
          </span>
          Viber
        </a>
      </div>
      <p className="mx-auto mt-1 max-w-md text-center text-[10px] font-semibold text-muted-foreground">
        {lang === "gr" ? "210 975 6277 · pisipouk@windowslive.com" : "210 975 6277 · pisipouk@windowslive.com"}
      </p>
    </div>
  );
}
