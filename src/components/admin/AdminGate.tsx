import { Link } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { useLanguage } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { refreshAdminGuard, useAdminGuard } from "./useAdminGuard";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const state = useAdminGuard();
  const { lang } = useLanguage();
  const [claiming, setClaiming] = useState(false);
  const T = (gr: string, en: string) => (lang === "gr" ? gr : en);

  if (state.loading) {
    return (
      <SiteLayout><Section><div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div></Section></SiteLayout>
    );
  }

  if (!state.authed) {
    return (
      <SiteLayout>
        <Section>
          <PageHeader eyebrow="Admin" title={T("Απαιτείται σύνδεση", "Sign in required")} />
          <div className="mx-auto mt-6 max-w-md text-center">
            <Button asChild className="rounded-full"><Link to="/login">{T("Σύνδεση", "Sign in")}</Link></Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  if (!state.isAdmin) {
    const claim = async () => {
      setClaiming(true);
      const { data, error } = await supabase.rpc("claim_first_admin");
      setClaiming(false);
      if (error) return toast.error(error.message);
      if (data === true) {
        toast.success(T("Έγινες admin!", "You are now admin!"));
        refreshAdminGuard();
      } else toast.error(T("Υπάρχει ήδη admin.", "An admin already exists."));
    };
    return (
      <SiteLayout>
        <Section>
          <PageHeader eyebrow="Admin" title={T("Δεν έχεις πρόσβαση", "No access")} />
          <div className="mx-auto mt-6 max-w-lg rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">
              {T("Αν είσαι ο πρώτος χρήστης, διεκδίκησε admin. Αλλιώς ζήτα από admin να σε προσθέσει.",
                 "If you are the first user, claim admin. Otherwise ask an admin to grant you access.")}
            </p>
            <Button onClick={claim} disabled={claiming} className="mt-5 rounded-full">
              {claiming ? "…" : T("Διεκδίκηση admin", "Claim admin")}
            </Button>
          </div>
        </Section>
      </SiteLayout>
    );
  }

  return <>{children}</>;
}