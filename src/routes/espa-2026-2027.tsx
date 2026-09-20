import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ExternalLink,
  FileCheck2,
  Info,
  PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/espa-2026-2027")({
  head: () => ({
    meta: [
      { title: "Voucher ΕΕΤΑΑ / ΕΣΠΑ 2026–2027 | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Απλός οδηγός γονέα για το voucher παιδικών σταθμών ΕΕΤΑΑ 2026–2027, με επίσημες πηγές και επόμενα βήματα.",
      },
    ],
  }),
  component: EspaGuidePage,
});

const officialProgram =
  "https://eetaa.gr/programma-proscholikis-agogis-kai-dimiourgikis-apascholisis-paidion-periodou-2026-2027/";
const officialAnnouncement =
  "https://eetaa.gr/nea-anakoinoseis/programma-paidikon-stathmon-2026-2027/";

function EspaGuidePage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-leaf px-4 py-2 text-sm font-black text-leaf-foreground">
            <BadgeCheck className="h-4 w-4" />
            {gr ? "ΕΝΗΜΕΡΩΣΗ ΓΟΝΕΩΝ 2026–2027" : "PARENT UPDATE 2026–2027"}
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            {gr
              ? "Voucher ΕΕΤΑΑ / ΕΣΠΑ χωρίς μπέρδεμα"
              : "EETAA voucher guidance, without the confusion"}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {gr
              ? "Συγκεντρώνουμε την επίσημη πληροφορία σε απλά βήματα. Η τελική επιβεβαίωση δικαιώματος, voucher και τοποθέτησης γίνεται πάντοτε από την ΕΕΤΑΑ."
              : "We summarize official information in plain steps. Eligibility, voucher and placement are always confirmed by EETAA."}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 lg:px-8">
          <div className="rounded-[2rem] border-2 border-primary/20 bg-card p-7 sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <CalendarCheck className="h-10 w-10 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-primary">
                  {gr ? "Τρέχουσα κατάσταση" : "Current status"}
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  {gr
                    ? "Τα οριστικά αποτελέσματα έχουν δημοσιευτεί"
                    : "Final results have been published"}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {gr
                    ? "Η ηλεκτρονική περίοδος αιτήσεων ήταν 18 Ιουλίου–5 Αυγούστου 2026. Η ΕΕΤΑΑ δημοσίευσε τα οριστικά αποτελέσματα στις 17 Αυγούστου 2026."
                    : "Online applications ran from 18 July to 5 August 2026. EETAA published final results on 17 August 2026."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                FileCheck2,
                gr ? "1. Ελέγξτε το αποτέλεσμα" : "1. Check the result",
                gr
                  ? "Μπείτε μόνο στην επίσημη σελίδα της ΕΕΤΑΑ και ελέγξτε την αξία τοποθέτησης."
                  : "Use only the official EETAA page to check the placement value.",
              ],
              [
                PhoneCall,
                gr ? "2. Μιλήστε με τον σταθμό" : "2. Contact the school",
                gr
                  ? "Επιβεβαιώστε διαθεσιμότητα, ηλικιακή κατηγορία και δυνατότητα ενεργοποίησης του voucher."
                  : "Confirm availability, age category and whether the voucher can be activated.",
              ],
              [
                BadgeCheck,
                gr ? "3. Ολοκληρώστε την τοποθέτηση" : "3. Complete placement",
                gr
                  ? "Ακολουθήστε τις επίσημες οδηγίες για σύμβαση, κάρτα παρουσίας και τυχόν μεταβολές."
                  : "Follow official instructions for contracts, attendance cards and changes.",
              ],
            ].map(([Icon, title, body]) => {
              const StepIcon = Icon as typeof FileCheck2;
              return (
                <article
                  key={String(title)}
                  className="rounded-[1.75rem] bg-muted p-6"
                >
                  <StepIcon className="h-7 w-7 text-primary" />
                  <h3 className="mt-5 text-xl font-black">{title as string}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {body as string}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="rounded-[2rem] bg-foreground p-7 text-background sm:p-9">
            <h2 className="text-2xl font-black">
              {gr ? "Επίσημες πηγές" : "Official sources"}
            </h2>
            <div className="mt-6 grid gap-3">
              <a
                href={officialProgram}
                target="_blank"
                rel="noreferrer"
                className="official-link"
              >
                <span>
                  <strong>
                    {gr
                      ? "Κεντρική σελίδα προγράμματος ΕΕΤΑΑ 2026–2027"
                      : "EETAA 2026–2027 program page"}
                  </strong>
                  <small>eetaa.gr</small>
                </span>
                <ExternalLink className="h-5 w-5" />
              </a>
              <a
                href={officialAnnouncement}
                target="_blank"
                rel="noreferrer"
                className="official-link"
              >
                <span>
                  <strong>
                    {gr
                      ? "Ανακοίνωση αιτήσεων και ημερομηνιών"
                      : "Application dates announcement"}
                  </strong>
                  <small>eetaa.gr</small>
                </span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border bg-sun/35 p-5 text-sm leading-6">
            <Info className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              {gr
                ? "Η σελίδα αυτή είναι ενημερωτική και δεν αντικαθιστά την ΕΕΤΑΑ. Ο Πισιπούκ δεν εγγυάται έκδοση voucher ή θέση πριν από προσωπική επιβεβαίωση."
                : "This page is informational and does not replace EETAA. Pisipouk cannot guarantee a voucher or place before personal confirmation."}
            </p>
          </div>

          <div className="rounded-[2rem] bg-blossom p-7 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-9">
            <div>
              <h2 className="text-2xl font-black">
                {gr
                  ? "Έχετε voucher ή χρειάζεστε καθοδήγηση;"
                  : "Have a voucher or need guidance?"}
              </h2>
              <p className="mt-2 text-blossom-foreground/80">
                {gr
                  ? "Στείλτε μας τα βασικά στοιχεία και θα επικοινωνήσουμε μαζί σας."
                  : "Send the basic details and we will contact you."}
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-6 shrink-0 rounded-full sm:mt-0"
            >
              <Link to="/enrollment">
                {gr ? "Δήλωση ενδιαφέροντος" : "Register interest"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
