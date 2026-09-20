import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock3, Leaf, ShieldCheck, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Διατροφή & Μενού Σεπτεμβρίου 2026 | Ο Πισιπούκ" },
      { name: "description", content: "Πρωινό 08:00–09:00, κυρίως γεύμα και συνοδευτικά στο ενδεικτικό μενού Σεπτεμβρίου 2026 του Πισιπούκ." },
    ],
  }),
  component: NutritionPage,
});

const weeks = [
  {
    title:"1–4 Σεπτεμβρίου",
    days:[
      ["Τρίτη 1/9","Ψωμί με μαρμελάδα • φρούτο","Ψαρόσουπα","Ψωμί • σαλάτα • φρούτο"],
      ["Τετάρτη 2/9","Αβγό • μπανάνα","Φασολάκια με πατάτες","Ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 3/9","Γάλα με δημητριακά • φρούτο","Κοτόπουλο κοκκινιστό με ρύζι","Ψωμί • τυρί • σαλάτα • φρούτο"],
      ["Παρασκευή 4/9","Κουλουράκια • βυσσινάδα","Μακαρόνια με κιμά","Ψωμί • τυρί • σαλάτα • φρούτο"],
    ],
  },
  {
    title:"7–11 Σεπτεμβρίου",
    days:[
      ["Δευτέρα 7/9","Φρουτοσαλάτα με γιαούρτι","Σπανακόρυζο","Ψωμί • τυρί • φρούτο"],
      ["Τρίτη 8/9","Ψωμί με μέλι • φρούτο","Ψαροκροκέτες με ρύζι","Ψωμί • σαλάτα • φρούτο"],
      ["Τετάρτη 9/9","Αβγό με ψωμί • μπανάνα","Φακές","Ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 10/9","Γάλα με δημητριακά • φρούτο","Κοτόσουπα","Ψωμί • τυρί • σαλάτα • φρούτο"],
      ["Παρασκευή 11/9","Μπισκότα • χυμός πορτοκαλιού","Ρολό κιμά με πουρέ","Ψωμί • τυρί • σαλάτα • φρούτο"],
    ],
  },
  {
    title:"14–18 Σεπτεμβρίου",
    days:[
      ["Δευτέρα 14/9","Κέικ καρότου • χυμός","Μακαρόνια με σάλτσα","Ψωμί • τυρί • φρούτο"],
      ["Τρίτη 15/9","Ψωμί με ταχίνι • φρούτο","Ψαρόσουπα","Ψωμί • φρούτο"],
      ["Τετάρτη 16/9","Αβγό • μπανάνα","Φασόλια χάντρες","Ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 17/9","Γάλα με δημητριακά • φρούτο","Κοτόπουλο γιουβέτσι","Ψωμί • τυρί • σαλάτα • φρούτο"],
      ["Παρασκευή 18/9","Τυρόπιτα • φρούτο","Κρεατόσουπα με λαχανικά","Ψωμί • τυρί • φρούτο"],
    ],
  },
  {
    title:"21–25 Σεπτεμβρίου",
    days:[
      ["Δευτέρα 21/9","Τσουρέκι • χυμός","Αρακάς με πατάτες","Ψωμί • τυρί • φρούτο"],
      ["Τρίτη 22/9","Ψωμί με μέλι • φρούτο","Ψαροκροκέτες με ρύζι","Ψωμί • σαλάτα • φρούτο"],
      ["Τετάρτη 23/9","Αβγό • μπανάνα","Φακές","Ψωμί • τυρί • φρούτο"],
      ["Πέμπτη 24/9","Γάλα με δημητριακά • φρούτο","Κοτόσουπα","Ψωμί • τυρί • σαλάτα"],
      ["Παρασκευή 25/9","Κουλουράκια με βυσσινάδα","Μοσχαράκι κοκκινιστό με μακαρονάκι","Ψωμί • τυρί • σαλάτα • φρούτο"],
    ],
  },
];

function NutritionPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="section-kicker">{gr ? "Η φροντίδα συνεχίζεται στο τραπέζι" : "Care continues at the table"}</p>
          <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">{gr ? "Πρωινό 08:00–09:00 και οργανωμένο καθημερινό μενού" : "Breakfast 08:00–09:00 and a structured daily menu"}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">{gr ? "Διορθώσαμε τη δομή του μενού: το πρώτο γεύμα είναι ΠΡΩΙΝΟ 08:00–09:00 — όχι «δεκατιανό». Ακολουθούν κυρίως γεύμα και συνοδευτικά." : "The first meal is BREAKFAST 08:00–09:00, followed by the main meal and accompaniments."}</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              [Clock3, gr ? "Πρωινό 08:00–09:00" : "Breakfast 08:00–09:00", gr ? "Ήρεμη έναρξη της ημέρας με οργανωμένο πρώτο γεύμα." : "A calm start with a structured first meal."],
              [UtensilsCrossed, gr ? "Κυρίως γεύμα" : "Main meal", gr ? "Εναλλαγή λαχανικών, οσπρίων, ψαριού, κοτόπουλου και κρέατος." : "A varied rotation of main dishes."],
              [ShieldCheck, gr ? "Αλλεργίες & ανάγκες" : "Allergies & needs", gr ? "Κάθε ειδική ανάγκη συζητείται προσωπικά πριν την έναρξη." : "Special needs are discussed before starting."],
            ].map(([Icon,title,body])=>{ const I=Icon as typeof Leaf; return <div key={String(title)} className="rounded-[1.5rem] border bg-white/80 p-5"><I className="h-7 w-7 text-primary"/><h2 className="mt-3 font-black">{title as string}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p></div>})}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">{gr ? "Σεπτέμβριος 2026" : "September 2026"}</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{gr ? "Το μηνιαίο μενού, καθαρά και σωστά σε mobile" : "The monthly menu, clear on every screen"}</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">{gr ? "Το παρακάτω βασίζεται στο μενού Σεπτεμβρίου που έχει σταλεί από τη διοίκηση. Η ονομασία του πρώτου γεύματος εμφανίζεται πλέον σωστά ως «Πρωινό 08:00–09:00»." : "The menu below is based on the September menu supplied by the school, with the first meal correctly labelled Breakfast 08:00–09:00."}</p>
          </div>

          <div className="mt-10 grid gap-7">
            {weeks.map((week)=><section key={week.title} className="rounded-[2rem] border bg-card p-5 shadow-sm sm:p-7">
              <h3 className="text-2xl font-black">{week.title}</h3>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {week.days.map(([day,breakfast,main,sides])=><article key={day} className="rounded-2xl bg-muted/45 p-5">
                  <h4 className="text-lg font-black">{day}</h4>
                  <dl className="mt-4 grid gap-3 text-sm">
                    <div><dt className="font-black text-primary">Πρωινό 08:00–09:00</dt><dd className="mt-1 leading-6">{breakfast}</dd></div>
                    <div><dt className="font-black">Κυρίως γεύμα</dt><dd className="mt-1 leading-6">{main}</dd></div>
                    <div><dt className="font-black text-muted-foreground">Συνοδευτικά</dt><dd className="mt-1 leading-6">{sides}</dd></div>
                  </dl>
                </article>)}
              </div>
            </section>)}
          </div>

          <div className="mt-10 rounded-[2rem] bg-leaf p-6 sm:p-8">
            <h2 className="text-2xl font-black">{gr ? "Σημαντικό για τους γονείς" : "Important for parents"}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {(gr ? ["Το μενού μπορεί να προσαρμόζεται ανάλογα με διαθεσιμότητα και εποχικότητα.","Αλλεργίες, δυσανεξίες και ιατρικές οδηγίες συζητούνται προσωπικά.","Το πρωινό σερβίρεται 08:00–09:00.","Για το τρέχον εβδομαδιαίο μενού επικοινωνήστε με τον σταθμό."] : ["Menu items may change with availability and seasonality.","Allergies and medical guidance are discussed personally.","Breakfast is served 08:00–09:00.","Contact the school for the current weekly menu."]).map(x=><li key={x} className="flex gap-3"><Check className="h-5 w-5 shrink-0"/><span className="font-bold">{x}</span></li>)}
            </ul>
            <Button asChild size="lg" className="mt-7 rounded-full"><Link to="/contact">{gr ? "Ρωτήστε μας για τη διατροφή" : "Ask us about meals"}<ArrowRight className="h-5 w-5"/></Link></Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
