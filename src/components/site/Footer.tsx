import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { ArrowRight } from "lucide-react";
import logoImage from "@/assets/pisipouk-logo.webp";

export function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

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
