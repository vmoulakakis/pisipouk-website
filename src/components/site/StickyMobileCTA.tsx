import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function StickyMobileCTA() {
  const { lang } = useLanguage();
  return (
    <div className="fixed inset-x-3 bottom-3 z-30 md:hidden">
      <Button asChild size="lg" className="w-full rounded-full shadow-lg">
        <Link to="/enrollment" className="flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5" />
          {dict.cta.book[lang]}
        </Link>
      </Button>
    </div>
  );
}