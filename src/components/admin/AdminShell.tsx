import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  AlertTriangle,
  Baby,
  Banknote,
  Bot,
  Building2,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  Menu,
  Megaphone,
  ReceiptText,
  ShieldCheck,
  Soup,
  TrendingUp,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SchoolYearProvider } from "@/lib/school-year-context";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { NotificationsBell } from "./NotificationsBell";

export function AdminShell() {
  return (
    <SchoolYearProvider>
      <AdminShellInner />
    </SchoolYearProvider>
  );
}

function AdminShellInner() {
  const { lang } = useLanguage();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const T = (gr: string, en: string) => (lang === "gr" ? gr : en);

  const groups = [
    {
      title: T("Κέντρο ελέγχου", "Control center"),
      items: [
        { to: "/admin", icon: LayoutDashboard, label: T("Αρχική ημέρας", "Daily home"), exact: true },
        { to: "/admin/school-years", icon: CalendarDays, label: T("Σχολικά έτη", "School years") },
        { to: "/admin/organization", icon: Building2, label: T("Οργάνωση σταθμού", "Organization") },
      ],
    },
    {
      title: T("Μητρώο", "Registry"),
      items: [
        { to: "/admin/families", icon: Home, label: T("Φάκελοι οικογενειών", "Family folders") },
        { to: "/admin/parents", icon: Users, label: T("Γονείς / κηδεμόνες", "Guardians") },
        { to: "/admin/children", icon: Baby, label: T("Παιδιά", "Children") },
        { to: "/admin/classes", icon: GraduationCap, label: T("Τμήματα", "Classes") },
        { to: "/admin/users", icon: UserCog, label: T("Χρήστες & ρόλοι", "Users & roles") },
      ],
    },
    {
      title: T("Καθημερινή λειτουργία", "Daily operations"),
      items: [
        { to: "/admin/attendance", icon: CalendarCheck, label: T("Παρουσιολόγιο", "Attendance") },
        { to: "/admin/reports", icon: ClipboardList, label: T("Ημερήσιες αναφορές", "Daily reports") },
        { to: "/admin/menus", icon: Soup, label: T("Εβδομαδιαίο menu", "Weekly menu") },
        { to: "/admin/menu-costing", icon: ReceiptText, label: T("Κοστολόγηση menu", "Menu costing") },
        { to: "/admin/incidents", icon: AlertTriangle, label: T("Συμβάντα", "Incidents") },
        { to: "/admin/consents", icon: FileCheck2, label: T("Συναινέσεις", "Consents") },
      ],
    },
    {
      title: T("Οικονομικά & ανάπτυξη", "Finance & growth"),
      items: [
        { to: "/admin/finance", icon: Banknote, label: T("Οικονομικά οικογενειών", "Family finance") },
        { to: "/admin/budget", icon: WalletCards, label: T("Budget σταθμού", "School budget") },
        { to: "/admin/purchases", icon: ReceiptText, label: T("Αγορές / προμηθευτές", "Purchases / suppliers") },
        { to: "/admin/leads", icon: Inbox, label: T("Admissions CRM", "Admissions CRM") },
      ],
    },
    {
      title: T("Επικοινωνία & AI", "Communication & AI"),
      items: [
        { to: "/admin/announcements", icon: Megaphone, label: T("Ανακοινώσεις", "Announcements") },
        { to: "/admin/requests", icon: ShieldCheck, label: T("Αιτήματα", "Requests") },
        { to: "/admin/calendar", icon: CalendarDays, label: T("Ημερολόγιο", "Calendar") },
        { to: "/admin/ai", icon: Bot, label: T("AI βοηθός", "AI assistant") },
      ],
    },
  ];

  const nav = groups.flatMap((g) => g.items);
  const isActive = (to: string, exact?: boolean) => exact ? loc.pathname === to : loc.pathname === to || loc.pathname.startsWith(to + "/");
  const current = nav.find((n) => isActive(n.to, n.exact)) ?? nav[0];

  const NavList = ({ onPick }: { onPick?: () => void }) => (
    <nav className="space-y-4">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase text-muted-foreground">{group.title}</p>
          <div className="space-y-1">
            {group.items.map((n) => {
              const active = isActive(n.to, n.exact);
              return (
                <Link key={n.to} to={n.to} onClick={onPick} className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                  <n.icon className="h-4 w-4" />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-4 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full gap-2">
                <Menu className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{current.label}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-4">
              <SheetHeader className="mb-3"><SheetTitle>{T("Λειτουργικό σύστημα σταθμού", "School operating system")}</SheetTitle></SheetHeader>
              <NavList onPick={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <SchoolYearSwitcher />
          <NotificationsBell />
        </div>
        <div className="mb-4 hidden items-center justify-end gap-2 md:flex">
          <NotificationsBell />
          <SchoolYearSwitcher />
        </div>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="hidden md:block">
            <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-border bg-card p-3 shadow-sm">
              <div className="mb-4 px-3 py-2">
                <p className="text-sm font-semibold">{T("Λειτουργικό σύστημα σταθμού", "School operating system")}</p>
                <p className="mt-1 text-xs text-muted-foreground">Admin</p>
              </div>
              <NavList />
            </div>
          </aside>
          <main className="min-w-0"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}