import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { Sparkles, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="container mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            Ο Πισιπούκ
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{dict.footer.tagline[lang]}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{lang === "gr" ? "Πλοήγηση" : "Navigation"}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{dict.nav.about[lang]}</Link></li>
            <li><Link to="/program" className="hover:text-foreground">{dict.nav.program[lang]}</Link></li>
            <li><Link to="/daily-life" className="hover:text-foreground">{dict.nav.daily[lang]}</Link></li>
            <li><Link to="/enrollment" className="hover:text-foreground">{dict.nav.enrollment[lang]}</Link></li>
            <li><Link to="/portal" className="hover:text-foreground">{dict.nav.portal[lang]}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{dict.nav.contact[lang]}</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4" /> {dict.contact.placeholderPhone}</li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4" /> {dict.contact.placeholderEmail}</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> {dict.contact.placeholderAddress[lang]}</li>
            <li className="pt-2 text-xs">{dict.contact.hoursValue[lang]}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {year} Ο Πισιπούκ. {dict.footer.rights[lang]}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">{dict.nav.privacy[lang]}</Link>
            <Link to="/terms" className="hover:text-foreground">{dict.nav.terms[lang]}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}