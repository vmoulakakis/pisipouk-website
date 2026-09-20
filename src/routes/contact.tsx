import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { dict } from "@/i18n/translations";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, PageHeader } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitLead, trackEvent } from "@/lib/pisipoukApi";
import { Phone, Mail, MapPin, Clock, CheckCircle2, AlertCircle, CalendarDays, ShieldCheck, MessageCircle, ExternalLink, Navigation } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία | Ο Πισιπούκ — Άγιος Δημήτριος" },
      { name: "description", content: "Επικοινωνήστε με τον Πισιπούκ, κλείστε επίσκεψη και ενημερωθείτε για θέσεις, πρόγραμμα και voucher 2026–2027." },
    ],
  }),
  component: ContactPage,
});

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=%CE%9F%20%CE%A0%CE%B9%CF%83%CE%B9%CF%80%CE%BF%CF%8D%CE%BA&query_place_id=ChIJp2TdCdC9oRQR4_25R-evEqE";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps?q=%CE%94%CE%B7%CE%BC%CE%B7%CF%84%CF%81%CE%AF%CE%BF%CF%85%20%CE%A8%CF%85%CF%87%CE%BF%CE%B3%CE%B9%CE%BF%CF%8D%2020%2C%2017341%20%CE%86%CE%B3%CE%B9%CE%BF%CF%82%20%CE%94%CE%B7%CE%BC%CE%AE%CF%84%CF%81%CE%B9%CE%BF%CF%82&output=embed";

function ContactPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  const [form, setForm] = useState({ name: "", phone: "", email: "", childAge: "", message: "", consent: false });
  const [state, setState] = useState<"idle"|"sending"|"sent"|"error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.consent) {
      setState("error");
      return;
    }
    setState("sending");
    await trackEvent("form_submit", { form: "contact" });
    try {
      await submitLead({
        parent_name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        child_age: form.childAge.trim(),
        message: form.message.trim(),
        gdpr_consent: true,
        page: "/contact"
      });
      setState("sent");
      await trackEvent("form_success", { form: "contact" });
    } catch (error) {
      console.error(error);
      setState("error");
      await trackEvent("form_error", { form: "contact" });
    }
  };

  const items = [
    { icon: Phone, label: gr ? "Τηλέφωνο" : "Phone", value: "210 975 6277", href: "tel:+302109756277" },
    { icon: Mail, label: "Email", value: "pisipouk@windowslive.com", href: "mailto:pisipouk@windowslive.com?subject=Επικοινωνία%20από%20το%20site%20Πισιπούκ" },
    { icon: MessageCircle, label: "Viber", value: "210 975 6277", href: "viber://contact?number=%2B302109756277" },
    { icon: MapPin, label: gr ? "Διεύθυνση" : "Address", value: gr ? "Δημητρίου Ψυχογιού 20, 17341 Άγιος Δημήτριος" : "20 Dimitriou Psychogiou, 17341 Agios Dimitrios" },
    { icon: Clock, label: gr ? "Ωράριο" : "Hours", value: gr ? "Δευτέρα–Παρασκευή 07:00–17:00" : "Monday–Friday 07:00–17:00" },
  ];

  return (
    <SiteLayout>
      <Section>
        <PageHeader
          eyebrow={gr ? "Μια πρώτη κουβέντα αρκεί" : "One conversation is enough to start"}
          title={gr ? "Πείτε μας τι χρειάζεται το παιδί σας" : "Tell us what your child needs"}
          subtitle={gr ? "Ρωτήστε μας για πρόγραμμα, προσαρμογή, διατροφή, σχολικό, voucher ή διαθεσιμότητα. Θα σας απαντήσουμε ανθρώπινα και συγκεκριμένα." : "Ask about the program, settling-in, meals, transport, voucher or availability."}
        />

        <div className="mx-auto mt-10 grid max-w-6xl gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5">
            <ul className="space-y-3 rounded-[2rem] bg-card p-6 shadow-sm">
              {items.map(({ icon: Icon, label, value, href }, i) => (
                <li key={i} className="flex items-start gap-4 rounded-2xl p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><Icon className="h-5 w-5" /></span>
                  <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>{href ? <a onClick={()=>trackEvent(label==="Viber"?"viber_click":label==="Email"?"email_click":"phone_click",{placement:"contact_page"})} href={href} className="mt-0.5 block font-bold hover:text-primary">{value}</a> : <p className="mt-0.5 font-bold">{value}</p>}</div>
                </li>
              ))}
            </ul>
            <div className="rounded-[2rem] bg-foreground p-6 text-background">
              <ShieldCheck className="h-8 w-8 text-sun" />
              <h2 className="mt-4 text-2xl font-black">{gr ? "Δεν χρειάζεται να αποφασίσετε από την οθόνη." : "You do not need to decide from a screen."}</h2>
              <p className="mt-3 leading-7 text-background/75">{gr ? "Η επιλογή παιδικού σταθμού είναι θέμα εμπιστοσύνης. Κλείστε μια επίσκεψη, δείτε τον χώρο και γνωρίστε την ομάδα πριν αποφασίσετε." : "Choosing a preschool is about trust. Visit the space and meet the team before deciding."}</p>
              <Button asChild variant="secondary" className="mt-5 rounded-full"><Link to="/book-visit"><CalendarDays className="h-4 w-4" />{gr ? "Κλείστε επίσκεψη" : "Book a visit"}</Link></Button>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-black">{gr ? "Ζητήστε να επικοινωνήσουμε μαζί σας" : "Ask us to contact you"}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{gr ? "Τα πεδία με * είναι απαραίτητα." : "Fields marked * are required."}</p>
            {state === "sent" ? (
              <div className="mt-8 rounded-3xl bg-leaf p-7 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12" />
                <h3 className="mt-3 text-2xl font-black">{gr ? "Το αίτημά σας καταχωρήθηκε." : "Your request has been recorded."}</h3>
                <p className="mt-2">{gr ? "Αν δεν λάβετε απάντηση σύντομα, καλέστε μας στο 210 975 6277." : "If you do not hear back soon, call us at +30 210 975 6277."}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>{gr ? "Ονοματεπώνυμο γονέα *" : "Parent name *"}</Label><Input className="mt-1.5" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div><Label>{gr ? "Τηλέφωνο *" : "Phone *"}</Label><Input className="mt-1.5" type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                  <div><Label>Email</Label><Input className="mt-1.5" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
                  <div><Label>{gr ? "Ηλικία παιδιού" : "Child age"}</Label><Input className="mt-1.5" placeholder={gr ? "π.χ. 3,5 ετών" : "e.g. 3.5 years"} value={form.childAge} onChange={e=>setForm({...form,childAge:e.target.value})} /></div>
                </div>
                <div><Label>{gr ? "Τι θα θέλατε να συζητήσουμε;" : "What would you like to discuss?"}</Label><Textarea className="mt-1.5" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div>
                <label className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3 text-sm"><Checkbox checked={form.consent} onCheckedChange={v=>setForm({...form,consent:Boolean(v)})} className="mt-0.5" /><span>{gr ? "Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για την επικοινωνία σχετικά με το αίτημά μου." : "I consent to my details being used only to respond to this request."}</span></label>
                {state === "error" && <div className="flex gap-2 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{gr ? "Ελέγξτε όνομα, τηλέφωνο και συγκατάθεση. Αν το πρόβλημα συνεχιστεί, καλέστε 210 975 6277." : "Check name, phone and consent. If the issue continues, please call us."}</div>}
                <Button type="submit" size="lg" className="w-full rounded-full" disabled={state==="sending"}>{state==="sending" ? (gr ? "Αποστολή..." : "Sending...") : (gr ? "Θέλω να μιλήσω με τον Πισιπούκ" : "I want to speak with Pisipouk")}</Button>
                <p className="text-center text-xs text-muted-foreground">{gr ? "Χωρίς δεσμεύσεις. Μια πρώτη επικοινωνία για να δείτε αν ταιριάζουμε στις ανάγκες της οικογένειάς σας." : "No obligation. A first conversation to see if we fit your family's needs."}</p>
              </form>
            )}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-[2rem] border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <iframe
              title={gr ? "Χάρτης Ο Πισιπούκ στον Άγιο Δημήτριο" : "Map of O Pisipouk in Agios Dimitrios"}
              src={GOOGLE_MAPS_EMBED_URL}
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="p-6 sm:p-8">
              <MapPin className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-2xl font-black">
                {gr ? "Βρείτε τον Πισιπούκ στο Google Maps" : "Find O Pisipouk on Google Maps"}
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                {gr
                  ? "Δημητρίου Ψυχογιού 20, 17341 Άγιος Δημήτριος. Ανοίξτε την επίσημη καταχώριση για πλοήγηση, στοιχεία επικοινωνίας και ενημερωμένο ωράριο."
                  : "20 Dimitriou Psychogiou, 17341 Agios Dimitrios. Open the official listing for directions, contact details and current opening hours."}
              </p>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("visit_click", { placement: "contact_google_maps" })}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                <Navigation className="h-4 w-4" />
                {gr ? "Οδηγίες στο Google Maps" : "Directions in Google Maps"}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
