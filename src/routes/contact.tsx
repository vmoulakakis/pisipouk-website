import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία | Contact — Ο Πισιπούκ" },
      { name: "description", content: "Τηλέφωνο, email, διεύθυνση και ωράριο λειτουργίας Δευτέρα–Παρασκευή 07:00–16:00." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useLanguage();
  const items = [
    { icon: Phone, label: dict.contact.phone[lang], value: dict.contact.placeholderPhone, href: `tel:${dict.contact.placeholderPhone.replace(/\s/g, "")}` },
    { icon: Mail, label: dict.contact.email[lang], value: dict.contact.placeholderEmail, href: `mailto:${dict.contact.placeholderEmail}` },
    { icon: MapPin, label: dict.contact.address[lang], value: dict.contact.placeholderAddress[lang] },
    { icon: Clock, label: dict.contact.hours[lang], value: dict.contact.hoursValue[lang] },
  ];

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={dict.nav.contact[lang]}
          title={lang === "gr" ? "Ελάτε να γνωριστούμε" : "Come and meet us"}
          subtitle={lang === "gr" ? "Είμαστε εδώ για κάθε σας ερώτηση." : "We're here for any question you may have."}
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          <ul className="space-y-3 rounded-3xl bg-card p-6 shadow-sm">
            {items.map(({ icon: Icon, label, value, href }, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl p-3 hover:bg-muted/40">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="mt-0.5 text-base font-medium hover:text-primary">{value}</a>
                  ) : (
                    <p className="mt-0.5 text-base font-medium">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="overflow-hidden rounded-3xl bg-card shadow-sm">
            <div className="aspect-square w-full bg-gradient-to-br from-sky to-leaf p-6 text-sky-foreground">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <MapPin className="h-12 w-12" />
                <p className="mt-3 text-lg font-semibold">{lang === "gr" ? "Ο χάρτης μας" : "Our location"}</p>
                <p className="mt-1 text-sm opacity-80">{dict.contact.placeholderAddress[lang]}</p>
                <p className="mt-3 text-xs opacity-70">{lang === "gr" ? "(Ενσωματωμένος χάρτης σε ετοιμασία)" : "(Embedded map coming soon)"}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}