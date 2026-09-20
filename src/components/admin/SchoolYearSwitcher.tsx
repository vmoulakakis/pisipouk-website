import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSchoolYear } from "@/lib/school-year-context";
import { useLanguage } from "@/i18n/LanguageProvider";

export function SchoolYearSwitcher() {
  const { years, current, setCurrentId, loading } = useSchoolYear();
  const { lang } = useLanguage();
  const T = (gr: string, en: string) => (lang === "gr" ? gr : en);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="font-semibold">{loading ? "…" : current?.title ?? T("Επιλογή έτους", "Select year")}</span>
          {current?.status === "active" && <Badge className="ml-1 h-5 px-2 text-[10px]">active</Badge>}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>{T("Σχολικό έτος", "School year")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {years.length === 0 && (
          <div className="px-2 py-3 text-xs text-muted-foreground">
            {T("Δεν έχει δημιουργηθεί ακόμη σχολικό έτος.", "No school year created yet.")}
          </div>
        )}
        {years.map((y) => (
          <DropdownMenuItem key={y.id} onClick={() => setCurrentId(y.id)} className="flex items-center justify-between">
            <span>{y.title}</span>
            <Badge variant={y.status === "active" ? "default" : "secondary"} className="text-[10px]">{y.status}</Badge>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/school-years/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {T("Νέο σχολικό έτος", "New school year")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/school-years">{T("Διαχείριση ετών", "Manage years")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}