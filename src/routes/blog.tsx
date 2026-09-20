import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useLanguage } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Heart, Sparkles, Brain, BookOpen, Clock3, Shuffle, Smile } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog Γονέων | Ο Πισιπούκ" },
      { name: "description", content: "Σύντομα, πρακτικά άρθρα για προσαρμογή, παιχνίδι, αυτονομία, συναισθήματα και καθημερινότητα παιδιών 2–6 ετών." },
    ],
  }),
  component: BlogPage,
});

type Article = { date:string; title:string; excerpt:string; tag:string; body:string[] };

const articles: Article[] = [
  {
    date:"20 Σεπ 2026", tag:"Προσαρμογή",
    title:"Πρώτες μέρες στον παιδικό: τι βοηθά πραγματικά ένα παιδί να νιώσει ασφάλεια;",
    excerpt:"Μικρές σταθερές κινήσεις που κάνουν τον αποχωρισμό πιο προβλέψιμο και λιγότερο φορτισμένο.",
    body:[
      "Η προσαρμογή δεν είναι αγώνας ταχύτητας. Κάθε παιδί χρειάζεται τον δικό του ρυθμό και μια σταθερή, προβλέψιμη ρουτίνα αποχωρισμού.",
      "Ένα σύντομο και σταθερό «αντίο», η ίδια μικρή φράση κάθε πρωί και η συνέπεια στο ποιος παραλαμβάνει το παιδί βοηθούν να δημιουργηθεί αίσθηση ασφάλειας.",
      "Σημαντικό είναι επίσης ο γονιός να παίρνει πραγματική εικόνα της ημέρας: τι έκανε το παιδί, πότε ηρέμησε, τι απόλαυσε και τι χρειάστηκε περισσότερη υποστήριξη."
    ]
  },
  {
    date:"15 Σεπ 2026", tag:"Παιχνίδι & μάθηση",
    title:"Το παιδί «απλώς παίζει»; Στην πραγματικότητα εξασκεί δεξιότητες ζωής",
    excerpt:"Τι μαθαίνει ένα παιδί όταν χτίζει πύργους, παίζει ρόλους, ζωγραφίζει ή συνεργάζεται με άλλα παιδιά.",
    body:[
      "Στο ελεύθερο και οργανωμένο παιχνίδι το παιδί δοκιμάζει ιδέες, μαθαίνει να περιμένει, να ζητά, να διαπραγματεύεται και να επιμένει.",
      "Οι κατασκευές καλλιεργούν επίλυση προβλημάτων, το θεατρικό παιχνίδι γλώσσα και κοινωνική κατανόηση, ενώ η κίνηση ενισχύει συντονισμό και αυτορρύθμιση.",
      "Ο ρόλος του ενήλικα δεν είναι να δίνει συνεχώς τη σωστή απάντηση αλλά να δημιουργεί ασφαλείς ευκαιρίες για εξερεύνηση."
    ]
  },
  {
    date:"10 Σεπ 2026", tag:"Αυτονομία",
    title:"«Θέλω να το κάνω μόνο μου»: πώς στηρίζουμε την αυτονομία χωρίς μάχη",
    excerpt:"Τρεις τρόποι να δώσουμε επιλογές και ευθύνη ανάλογα με την ηλικία, χωρίς να χάνεται το όριο.",
    body:[
      "Η ανάγκη για αυτονομία είναι αναπτυξιακά φυσιολογική. Μικρές επιλογές —δύο μπλούζες, δύο βιβλία, δύο τρόποι να ξεκινήσει μια εργασία— δίνουν έλεγχο χωρίς να μεταφέρουν όλη την ευθύνη στο παιδί.",
      "Τα καθαρά όρια λειτουργούν καλύτερα όταν είναι λίγα, σταθερά και διατυπωμένα απλά.",
      "Ο στόχος δεν είναι η τέλεια υπακοή αλλά η σταδιακή ικανότητα του παιδιού να κάνει πράγματα μόνο του και να ζητά βοήθεια όταν τη χρειάζεται."
    ]
  },
  {
    date:"05 Σεπ 2026", tag:"Συναισθήματα",
    title:"Μεγάλα συναισθήματα σε μικρά παιδιά: τι λέμε την ώρα της έντασης;",
    excerpt:"Λιγότερες εξηγήσεις, περισσότερη σύνδεση: μια πρακτική σειρά αντιδράσεων για δύσκολες στιγμές.",
    body:[
      "Όταν το παιδί είναι πολύ φορτισμένο, οι μεγάλες εξηγήσεις συνήθως δεν βοηθούν. Πρώτα χρειάζεται να νιώσει ότι ο ενήλικας είναι ήρεμος και διαθέσιμος.",
      "Ονοματίζουμε με απλά λόγια: «βλέπω ότι θύμωσες πολύ». Μετά κρατάμε το όριο: «δεν χτυπάμε». Τέλος προσφέρουμε μια μικρή εναλλακτική: «πάμε να πατήσουμε δυνατά τα πόδια ή να πάρουμε τρεις αργές ανάσες».",
      "Αργότερα, όταν το σώμα έχει ηρεμήσει, μπορούμε να συζητήσουμε τι συνέβη."
    ]
  },
  {
    date:"31 Αυγ 2026", tag:"Γονείς & σχολείο",
    title:"5 ερωτήσεις που αξίζει να κάνετε όταν επισκέπτεστε έναν παιδικό σταθμό",
    excerpt:"Όχι μόνο «πόσο κοστίζει;». Οι ερωτήσεις που αποκαλύπτουν την πραγματική καθημερινότητα του παιδιού.",
    body:[
      "Ρωτήστε πώς γίνεται η προσαρμογή, πώς ενημερώνονται οι γονείς, τι συμβαίνει όταν ένα παιδί δυσκολεύεται, πόσο χρόνο περνά η ομάδα έξω και πώς οργανώνεται η καθημερινή ρουτίνα.",
      "Παρατηρήστε τον τρόπο που οι ενήλικες μιλούν στα παιδιά και όχι μόνο τον εξοπλισμό του χώρου.",
      "Η σωστή επιλογή δεν είναι απλώς αυτή με τις περισσότερες παροχές· είναι εκείνη στην οποία η φιλοσοφία και η καθημερινότητα ταιριάζουν με τις ανάγκες της δικής σας οικογένειας."
    ]
  },
  {
    date:"26 Αυγ 2026", tag:"Ρουτίνα",
    title:"Πρωινά χωρίς πανικό: μια ρουτίνα 4 βημάτων για παιδιά προσχολικής ηλικίας",
    excerpt:"Ένας μικρός οπτικός «χάρτης» που βοηθά το παιδί να ξέρει τι ακολουθεί.",
    body:[
      "Οι μεταβάσεις γίνονται ευκολότερες όταν το παιδί γνωρίζει τι έρχεται μετά. Δοκιμάστε τέσσερις εικόνες ή λέξεις: ντύνομαι, τρώω, βουρτσίζω δόντια, φεύγουμε.",
      "Κρατήστε τη σειρά σταθερή και αφήστε το παιδί να μετακινεί μια κάρτα ή να βάζει ένα σημάδι όταν ολοκληρώνει κάθε βήμα.",
      "Δεν χρειάζεται ανταμοιβή κάθε φορά. Η ίδια η προβλεψιμότητα είναι συχνά η μεγαλύτερη βοήθεια."
    ]
  }
];

const games = [
  { icon: Smile, title:"Το πρόσωπο του συναισθήματος", text:"Κάντε εναλλάξ μια έκφραση και μαντέψτε το συναίσθημα. Μετά πείτε μια στιγμή που το νιώσατε." },
  { icon: Shuffle, title:"Βρες 3 πράγματα", text:"Διαλέξτε χρώμα ή σχήμα και βρείτε μαζί 3 αντικείμενα στο σπίτι ή στη βόλτα." },
  { icon: Sparkles, title:"Η ιστορία των 3 λέξεων", text:"Ο γονιός δίνει 3 λέξεις. Το παιδί φτιάχνει μια μικρή ιστορία και μετά αλλάζετε ρόλους." },
];

function BlogPage(){
  const { lang } = useLanguage();
  const gr = lang === "gr";
  const [open, setOpen] = useState<number|null>(0);
  const [game, setGame] = useState(0);
  const featured = useMemo(()=>articles[0],[]);

  return <SiteLayout>
    <section className="hero-field py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <p className="section-kicker">{gr ? "Για γονείς, χωρίς θεωρία για τη θεωρία" : "Practical ideas for parents"}</p>
        <h1 className="mt-3 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">{gr ? "Μικρές ιδέες που κάνουν την καθημερινότητα λίγο πιο εύκολη." : "Small ideas that make family life a little easier."}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{gr ? "Κάθε 5 ημέρες ένα νέο, σύντομο και εφαρμόσιμο άρθρο για παιδιά 2–6 ετών: προσαρμογή, παιχνίδι, αυτονομία, συναισθήματα και σχέση οικογένειας–σχολείου." : "A new practical article every five days for families with children aged 2–6."}</p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background"><Clock3 className="h-4 w-4" />{gr ? "Νέο άρθρο κάθε 5 ημέρες" : "New article every 5 days"}</div>
      </div>
    </section>

    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-[2rem] bg-foreground p-7 text-background sm:p-10">
            <div className="flex items-center gap-2 text-sm font-bold text-sun"><Brain className="h-5 w-5" />{featured.tag} · {featured.date}</div>
            <h2 className="mt-5 text-4xl font-black leading-tight">{featured.title}</h2>
            <p className="mt-4 text-lg leading-8 text-background/75">{featured.excerpt}</p>
            <Button onClick={()=>setOpen(0)} variant="secondary" className="mt-6 rounded-full">{gr ? "Διαβάστε το άρθρο" : "Read article"}<ArrowRight className="h-4 w-4" /></Button>
          </article>
          <div className="rounded-[2rem] bg-sun p-7 sm:p-10">
            <Heart className="h-9 w-9" />
            <h2 className="mt-5 text-3xl font-black">{gr ? "5 λεπτά μαζί" : "Five minutes together"}</h2>
            <p className="mt-3 leading-7 text-foreground/70">{gr ? "Όχι άλλο ένα παιχνίδι οθόνης. Μια μικρή αφορμή για να μιλήσετε, να κινηθείτε ή να δημιουργήσετε μαζί." : "Not another screen game — a prompt to talk, move or create together."}</p>
            <div className="mt-6 rounded-3xl bg-white/70 p-5">
              {(() => { const G=games[game].icon; return <><G className="h-7 w-7 text-primary" /><h3 className="mt-3 text-xl font-black">{games[game].title}</h3><p className="mt-2 leading-7">{games[game].text}</p></> })()}
            </div>
            <Button onClick={()=>setGame((game+1)%games.length)} className="mt-5 rounded-full"><Shuffle className="h-4 w-4" />{gr ? "Δώσε μου άλλο παιχνίδι" : "Give me another game"}</Button>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {articles.map((a,i)=><article key={a.title} className="rounded-[2rem] border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground"><span className="rounded-full bg-muted px-3 py-1">{a.tag}</span><span>{a.date}</span></div>
            <h2 className="mt-4 text-2xl font-black leading-tight">{a.title}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{a.excerpt}</p>
            <button onClick={()=>setOpen(open===i?null:i)} className="mt-5 inline-flex items-center gap-2 font-black text-primary">{open===i ? (gr?"Κλείσιμο":"Close") : (gr?"Διαβάστε":"Read")}<ArrowRight className="h-4 w-4" /></button>
            {open===i && <div className="mt-5 space-y-4 border-t pt-5 text-[15px] leading-7">{a.body.map(p=><p key={p}>{p}</p>)}</div>}
          </article>)}
        </div>
      </div>
    </section>

    <section className="pb-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="rounded-[2.5rem] bg-leaf p-8 sm:p-12">
          <BookOpen className="h-9 w-9" />
          <h2 className="mt-4 text-4xl font-black">{gr ? "Το blog βοηθά. Η επίσκεψη απαντά στα δικά σας ερωτήματα." : "The blog helps. A visit answers your own questions."}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">{gr ? "Ελάτε να δείτε τον χώρο και να συζητήσουμε για την ηλικία, τον χαρακτήρα και τις ανάγκες του παιδιού σας." : "Come see the space and talk about your child's age, personality and needs."}</p>
          <Button asChild size="lg" className="mt-7 rounded-full"><Link to="/book-visit"><CalendarDays className="h-5 w-5" />{gr ? "Κλείστε γνωριμία" : "Book a visit"}</Link></Button>
        </div>
      </div>
    </section>
  </SiteLayout>
}
