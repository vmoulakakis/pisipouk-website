import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { ArrowRight, Share2, MapPin, ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";
import logoImage from "@/assets/pisipouk-logo.webp";

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=%CE%9F%20%CE%A0%CE%B9%CF%83%CE%B9%CF%80%CE%BF%CF%8D%CE%BA&query_place_id=ChIJp2TdCdC9oRQR4_25R-evEqE";

export function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?utm_source=parent_share&utm_medium=referral&utm_campaign=local_word_of_mouth`;
    await trackEvent("share_click", { placement: "footer" });
    if (navigator.share) await navigator.share({ title: "Ο Πισιπούκ", text: "Δείτε τον Πισιπούκ — Παιδικός Σταθμός & Νηπιαγωγείο στον Άγιο Δημήτριο.", url }).catch(()=>{});
    else await navigator.clipboard.writeText(url).catch(()=>{});
  };

  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-lg font-black">
            <img
              src={logoImage}
              alt=""
              className="h-14 w-14 object-contain"
              aria-hidden="true"
            />
            Ο Πισιπούκ
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            {dict.footer.tagline[lang]}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">
            {lang === "gr" ? "Πλοήγηση" : "Navigation"}
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                {dict.nav.about[lang]}
              </Link>
            </li>
            <li>
              <Link to="/program" className="hover:text-foreground">
                {dict.nav.program[lang]}
              </Link>
            </li>
            <li>
              <Link to="/daily-life" className="hover:text-foreground">
                {dict.nav.daily[lang]}
              </Link>
            </li>
            <li>
              <Link to="/enrollment" className="hover:text-foreground">
                {dict.nav.enrollment[lang]}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground">
                {dict.nav.faq[lang]}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{dict.nav.contact[lang]}</h4>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {lang === "gr"
              ? "Για πληροφορίες, διαθεσιμότητα και προγραμματισμό επίσκεψης, στείλτε μας το μήνυμά σας."
              : "For information, availability and visits, send us your message."}
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            {lang === "gr" ? "Σελίδα επικοινωνίας" : "Contact page"}{" "}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("visit_click", { placement: "footer_google_maps" })}
            className="mt-4 flex items-start gap-2 text-sm font-bold text-foreground hover:text-primary"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {lang === "gr" ? "Δημητρίου Ψυχογιού 20, Άγιος Δημήτριος" : "20 Dimitriou Psychogiou, Agios Dimitrios"}
            </span>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          </a>
          <button onClick={share} className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold hover:bg-background">
            <Share2 className="h-4 w-4" />{lang === "gr" ? "Μοιραστείτε τον Πισιπούκ" : "Share Pisipouk"}
          </button>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>
            © {year} Ο Πισιπούκ. {dict.footer.rights[lang]}
          </p>
          <Link to="/contact" className="hover:text-foreground">
            {dict.nav.contact[lang]}
          </Link>
        </div>
      </div>
    </footer>
  );
}
