import { useLanguage } from "@/i18n/LanguageProvider";
import { Mail, Phone, MessageCircle } from "lucide-react";

export function StickyMobileCTA() {
  const { lang } = useLanguage();
  return (
    <div className="fixed inset-x-2 bottom-2 z-30 grid grid-cols-3 gap-2 rounded-2xl border bg-background/95 p-2 shadow-2xl backdrop-blur md:hidden">
      <a href="tel:+302109756277" className="flex min-h-14 flex-col items-center justify-center rounded-xl bg-primary px-2 text-xs font-black text-primary-foreground">
        <Phone className="mb-1 h-5 w-5" />
        {lang === "gr" ? "Κλήση" : "Call"}
      </a>
      <a href="viber://contact?number=%2B302109756277" className="flex min-h-14 flex-col items-center justify-center rounded-xl bg-secondary px-2 text-xs font-black text-secondary-foreground">
        <MessageCircle className="mb-1 h-5 w-5" />
        Viber
      </a>
      <a href="mailto:pisipouk@windowslive.com?subject=Επικοινωνία%20από%20το%20site%20Πισιπούκ" className="flex min-h-14 flex-col items-center justify-center rounded-xl border bg-card px-2 text-xs font-black">
        <Mail className="mb-1 h-5 w-5" />
        Email
      </a>
    </div>
  );
}
