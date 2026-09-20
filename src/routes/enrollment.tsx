import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict, type Lang } from "@/i18n/translations";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/enrollment")({
  head: () => ({
    meta: [
      { title: "Εγγραφές | Enrollment — Ο Πισιπούκ" },
      { name: "description", content: "Κλείστε ραντεβού γνωριμίας και ξεκινήστε τη διαδικασία εγγραφής στον παιδικό σταθμό Πισιπούκ." },
    ],
  }),
  component: EnrollmentPage,
});

const buildSchema = (lang: Lang) => {
  const r = dict.validation.required[lang];
  const e = dict.validation.email[lang];
  const p = dict.validation.phone[lang];
  const g = dict.validation.gdpr[lang];
  return z.object({
    parent_name: z.string().trim().min(1, r).max(200),
    phone: z.string().trim().min(4, p).max(40),
    email: z.string().trim().email(e).max(255).optional().or(z.literal("")),
    child_name: z.string().trim().max(200).optional().or(z.literal("")),
    child_age: z.string().trim().max(40).optional().or(z.literal("")),
    desired_start: z.string().optional().or(z.literal("")),
    interest: z.enum(["preschool", "kindergarten", "both"]),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    gdpr_consent: z.literal(true, { errorMap: () => ({ message: g }) }),
  });
};

function EnrollmentPage() {
  const { lang } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    parent_name: "", phone: "", email: "", child_name: "", child_age: "",
    desired_start: "", interest: "preschool" as "preschool" | "kindergarten" | "both",
    message: "", gdpr_consent: false,
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErr(null);
    const schema = buildSchema(lang);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const payload = {
        parent_name: parsed.data.parent_name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        child_name: parsed.data.child_name || null,
        child_age: parsed.data.child_age || null,
        desired_start: parsed.data.desired_start || null,
        interest: parsed.data.interest,
        message: parsed.data.message || null,
        gdpr_consent: parsed.data.gdpr_consent,
        source: "website" as const,
      };
      const { error } = await supabase.from("leads").insert(payload);
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setServerErr(dict.form.error[lang]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={lang === "gr" ? "Εγγραφές" : "Enrollment"}
          title={lang === "gr" ? "Κλείστε ραντεβού γνωριμίας" : "Book an introductory visit"}
          subtitle={lang === "gr"
            ? "Συμπληρώστε τη φόρμα και θα σας καλέσουμε για να γνωριστούμε από κοντά."
            : "Fill out the form and we'll call you to meet in person."}
        />

        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {submitted ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h2 className="mt-4 text-2xl font-bold">{lang === "gr" ? "Σας ευχαριστούμε!" : "Thank you!"}</h2>
              <p className="mt-2 text-muted-foreground">{dict.form.success[lang]}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={dict.form.parentName[lang]} error={errors.parent_name} required>
                  <Input value={form.parent_name} onChange={(e) => update("parent_name", e.target.value)} maxLength={200} />
                </Field>
                <Field label={dict.form.phone[lang]} error={errors.phone} required>
                  <Input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} maxLength={40} />
                </Field>
                <Field label={dict.form.email[lang]} error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={255} />
                </Field>
                <Field label={dict.form.childName[lang]}>
                  <Input value={form.child_name} onChange={(e) => update("child_name", e.target.value)} maxLength={200} />
                </Field>
                <Field label={dict.form.childAge[lang]}>
                  <Input value={form.child_age} onChange={(e) => update("child_age", e.target.value)} maxLength={40} placeholder={lang === "gr" ? "π.χ. 3 ετών" : "e.g. 3 years"} />
                </Field>
                <Field label={dict.form.desiredStart[lang]}>
                  <Input type="date" value={form.desired_start} onChange={(e) => update("desired_start", e.target.value)} />
                </Field>
              </div>

              <div>
                <Label className="mb-2 block">{dict.form.interest[lang]}</Label>
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["preschool", "kindergarten", "both"] as const).map((opt) => {
                    const labelMap = {
                      preschool: dict.form.interestPreschool,
                      kindergarten: dict.form.interestKindergarten,
                      both: dict.form.interestBoth,
                    };
                    const checked = form.interest === opt;
                    return (
                      <label key={opt} className={`cursor-pointer rounded-2xl border p-3 text-center text-sm transition-colors ${checked ? "border-primary bg-primary/10 font-semibold" : "border-border hover:bg-accent"}`}>
                        <input type="radio" name="interest" value={opt} checked={checked} onChange={() => update("interest", opt)} className="sr-only" />
                        {labelMap[opt][lang]}
                      </label>
                    );
                  })}
                </div>
              </div>

              <Field label={dict.form.message[lang]}>
                <Textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} maxLength={2000} />
              </Field>

              <label className="flex items-start gap-3 rounded-2xl bg-muted/40 p-3 text-sm">
                <Checkbox checked={form.gdpr_consent} onCheckedChange={(v) => update("gdpr_consent", Boolean(v))} className="mt-0.5" />
                <span className="leading-snug">{dict.form.gdprLabel[lang]}</span>
              </label>
              {errors.gdpr_consent && <p className="text-sm text-destructive">{errors.gdpr_consent}</p>}

              {serverErr && (
                <div className="flex items-center gap-2 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" /> {serverErr}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
                {submitting ? dict.cta.sending[lang] : dict.cta.submit[lang]}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </SiteLayout>
  );
}

function Field({ label, children, error, required }: { label: string; children: React.ReactNode; error?: string; required?: boolean }) {
  return (
    <div>
      <Label className="mb-1.5 block">
        {label}{required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}