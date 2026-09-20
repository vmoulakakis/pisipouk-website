import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  Clock3,
  Heart,
  Shuffle,
  Smile,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { blogArticles } from "@/content/blogArticles";
import { useLanguage } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      {
        title:
          "Blog Γονέων: Παιδικός Σταθμός, Προσαρμογή & Ανάπτυξη | Πισιπούκ",
      },
      {
        name: "description",
        content:
          "Πρακτικοί, τεκμηριωμένοι οδηγοί για γονείς παιδιών 2–6 ετών: προσαρμογή στον παιδικό, παιχνίδι, αυτονομία, συναισθήματα, ρουτίνες και επιλογή σχολείου.",
      },
      {
        name: "robots",
        content:
          "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
      },
      {
        property: "og:title",
        content: "Blog Γονέων | Ο Πισιπούκ",
      },
      {
        property: "og:description",
        content:
          "Χρήσιμοι οδηγοί για την καθημερινότητα οικογενειών με παιδιά 2–6 ετών.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "el_GR" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://pisipouk.vercel.app/blog",
      },
    ],
  }),
  component: BlogPage,
});

const games = [
  {
    icon: Smile,
    title: "Το πρόσωπο του συναισθήματος",
    text: "Κάντε εναλλάξ μια έκφραση και μαντέψτε το συναίσθημα. Μετά πείτε μια στιγμή που το νιώσατε.",
  },
  {
    icon: Shuffle,
    title: "Βρες 3 πράγματα",
    text: "Διαλέξτε χρώμα ή σχήμα και βρείτε μαζί 3 αντικείμενα στο σπίτι ή στη βόλτα.",
  },
  {
    icon: Sparkles,
    title: "Η ιστορία των 3 λέξεων",
    text: "Ο γονιός δίνει 3 λέξεις. Το παιδί φτιάχνει μια μικρή ιστορία και μετά αλλάζετε ρόλους.",
  },
];

function BlogPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";
  const [game, setGame] = useState(0);
  const featured = useMemo(() => blogArticles[0], []);
  const categories = useMemo(
    () => Array.from(new Set(blogArticles.map((article) => article.tag))),
    [],
  );

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="section-kicker">
            {gr
              ? "Οδηγοί για την πραγματική καθημερινότητα με παιδιά 2–6 ετών"
              : "Practical guides for families with children aged 2–6"}
          </p>
          <h1 className="mt-3 max-w-5xl text-5xl font-black tracking-tight sm:text-7xl">
            {gr
              ? "Απαντήσεις σε ερωτήσεις που οι γονείς ψάχνουν πραγματικά."
              : "Useful answers to real questions parents ask."}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            {gr
              ? "Προσαρμογή στον παιδικό, επιλογή σχολείου, παιχνίδι, αυτονομία, συναισθήματα και ρουτίνες. Κάθε θέμα έχει πλέον δική του σελίδα, πηγές και πρακτικά βήματα."
              : "Preschool transition, choosing a school, play, independence, emotions and routines. Each topic has its own in-depth page with sources and practical steps."}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border bg-background/70 px-3 py-1.5 text-sm font-bold"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <article className="rounded-[2rem] bg-foreground p-7 text-background sm:p-10">
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-sun">
                <Brain className="h-5 w-5" />
                <span>{featured.tag}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={featured.publishedAt}>{featured.displayDate}</time>
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight">
                <Link
                  to="/blog/$slug"
                  params={{ slug: featured.slug }}
                  className="hover:text-sun"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 text-lg leading-8 text-background/75">
                {featured.excerpt}
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-background/65">
                <Clock3 className="h-4 w-4" />
                {featured.readMinutes} {gr ? "λεπτά ανάγνωσης" : "min read"}
              </div>
              <Button
                asChild
                variant="secondary"
                className="mt-6 rounded-full"
              >
                <Link to="/blog/$slug" params={{ slug: featured.slug }}>
                  {gr ? "Διαβάστε τον οδηγό" : "Read the guide"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </article>

            <div className="rounded-[2rem] bg-sun p-7 sm:p-10">
              <Heart className="h-9 w-9" />
              <h2 className="mt-5 text-3xl font-black">
                {gr ? "5 λεπτά μαζί" : "Five minutes together"}
              </h2>
              <p className="mt-3 leading-7 text-foreground/70">
                {gr
                  ? "Μια μικρή αφορμή για να μιλήσετε, να κινηθείτε ή να δημιουργήσετε μαζί — χωρίς άλλη οθόνη."
                  : "A small prompt to talk, move or create together without another screen."}
              </p>
              <div className="mt-6 rounded-3xl bg-white/70 p-5">
                {(() => {
                  const G = games[game].icon;
                  return (
                    <>
                      <G className="h-7 w-7 text-primary" />
                      <h3 className="mt-3 text-xl font-black">
                        {games[game].title}
                      </h3>
                      <p className="mt-2 leading-7">{games[game].text}</p>
                    </>
                  );
                })()}
              </div>
              <Button
                onClick={() => setGame((game + 1) % games.length)}
                className="mt-5 rounded-full"
              >
                <Shuffle className="h-4 w-4" />
                {gr ? "Δώσε μου άλλη ιδέα" : "Give me another idea"}
              </Button>
            </div>
          </div>

          <div className="mt-14 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker">
                {gr ? "Βιβλιοθήκη γονέων" : "Parent library"}
              </p>
              <h2 className="mt-2 text-4xl font-black">
                {gr ? "Όλοι οι οδηγοί" : "All guides"}
              </h2>
            </div>
            <span className="hidden text-sm font-semibold text-muted-foreground sm:block">
              {blogArticles.length} {gr ? "άρθρα" : "articles"}
            </span>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {blogArticles.map((article) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col rounded-[2rem] border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-muted-foreground">
                  <span className="rounded-full bg-muted px-3 py-1">
                    {article.tag}
                  </span>
                  <time dateTime={article.publishedAt}>{article.displayDate}</time>
                </div>

                <h2 className="mt-4 text-2xl font-black leading-tight">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: article.slug }}
                    className="transition-colors group-hover:text-primary"
                  >
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-3 flex-1 leading-7 text-muted-foreground">
                  {article.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between border-t pt-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    {article.readMinutes} {gr ? "λεπτά" : "min"}
                  </span>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: article.slug }}
                    className="inline-flex items-center gap-1.5 font-black text-primary"
                    aria-label={`Διαβάστε: ${article.title}`}
                  >
                    {gr ? "Διαβάστε" : "Read"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_.7fr]">
            <div className="rounded-[2.5rem] bg-leaf p-8 sm:p-12">
              <BookOpen className="h-9 w-9" />
              <h2 className="mt-4 text-4xl font-black">
                {gr
                  ? "Το blog βοηθά να ξέρετε τι να ρωτήσετε."
                  : "The blog helps you know what to ask."}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
                {gr
                  ? "Η πραγματική επιλογή σχολείου γίνεται από κοντά: δείτε τον χώρο, τη ροή της ημέρας και γνωρίστε την ομάδα."
                  : "The real school decision happens in person: see the space, daily rhythm and meet the team."}
              </p>
              <Button asChild size="lg" className="mt-7 rounded-full">
                <Link to="/book-visit">
                  <CalendarDays className="h-5 w-5" />
                  {gr ? "Κλείστε γνωριμία" : "Book a visit"}
                </Link>
              </Button>
            </div>

            <div className="rounded-[2.5rem] border bg-card p-8 sm:p-10">
              <p className="text-sm font-black uppercase tracking-wider text-primary">
                {gr ? "Πώς γράφουμε" : "Editorial standard"}
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {gr
                  ? "Χρήσιμο πρώτα. SEO μετά."
                  : "Useful first. SEO second."}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {gr
                  ? "Τα άρθρα βασίζονται σε πραγματικές ερωτήσεις γονέων, πρακτική προσχολική καθημερινότητα και αξιόπιστες πηγές. Δεν χρησιμοποιούμε τρομολαγνεία, ψεύτικες υποσχέσεις ή ιατρικές διαγνώσεις."
                  : "Articles focus on real parent questions, practical early-years life and trustworthy sources without sensationalism or medical diagnosis."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
