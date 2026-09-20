import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  ExternalLink,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import {
  getBlogArticle,
  getRelatedArticles,
} from "@/content/blogArticles";

const ORIGIN = "https://pisipouk.vercel.app";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const article = getBlogArticle(params.slug);

    if (!article) {
      return {
        meta: [
          { title: "Άρθρο δεν βρέθηκε | Ο Πισιπούκ" },
          { name: "robots", content: "noindex,follow" },
        ],
      };
    }

    const url = `${ORIGIN}/blog/${article.slug}`;

    return {
      meta: [
        { title: article.seoTitle },
        { name: "description", content: article.metaDescription },
        {
          name: "keywords",
          content: article.keywords.join(", "),
        },
        { name: "author", content: "Ομάδα Πισιπούκ" },
        {
          name: "robots",
          content:
            "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
        },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "Ο Πισιπούκ" },
        { property: "og:locale", content: "el_GR" },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.metaDescription },
        { property: "og:url", content: url },
        { property: "article:published_time", content: article.publishedAt },
        { property: "article:modified_time", content: article.updatedAt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: article.title },
        { name: "twitter:description", content: article.metaDescription },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogArticlePage,
});

function BlogArticlePage() {
  const { slug } = Route.useParams();
  const article = getBlogArticle(slug);

  if (!article) {
    return (
      <SiteLayout>
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <h1 className="text-4xl font-black">Το άρθρο δεν βρέθηκε</h1>
            <p className="mt-4 text-muted-foreground">
              Η σελίδα που ζητήσατε δεν υπάρχει ή έχει μετακινηθεί.
            </p>
            <Button asChild className="mt-7 rounded-full">
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4" />
                Επιστροφή στο blog
              </Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const related = getRelatedArticles(article.slug);
  const canonicalUrl = `${ORIGIN}/blog/${article.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: canonicalUrl,
    inLanguage: "el-GR",
    author: {
      "@type": "Organization",
      name: "Ο Πισιπούκ",
      url: ORIGIN,
    },
    publisher: {
      "@type": "Organization",
      name: "Ο Πισιπούκ",
      url: ORIGIN,
    },
    keywords: article.keywords.join(", "),
    about: article.tag,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Αρχική",
        item: `${ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog γονέων",
        item: `${ORIGIN}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <SiteLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {article.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article>
        <header className="hero-field py-14 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="hover:text-foreground">
                Αρχική
              </Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{article.tag}</span>
            </nav>

            <span className="inline-flex rounded-full bg-sun px-3 py-1 text-sm font-black">
              {article.tag}
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl">
              {article.title}
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-8 text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-semibold text-muted-foreground">
              <span>Ομάδα Πισιπούκ</span>
              <span aria-hidden="true">•</span>
              <time dateTime={article.publishedAt}>{article.displayDate}</time>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {article.readMinutes} λεπτά ανάγνωσης
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
          <div className="min-w-0">
            <p className="text-xl font-medium leading-9 text-foreground/85">
              {article.intro}
            </p>

            <div className="mt-10 space-y-12">
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-3xl font-black leading-tight">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-[17px] leading-8 text-foreground/80">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="list-disc space-y-2 pl-6">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {article.faq.length > 0 && (
              <section className="mt-14 border-t pt-10" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="text-3xl font-black">
                  Συχνές ερωτήσεις
                </h2>
                <div className="mt-6 space-y-5">
                  {article.faq.map((item) => (
                    <div key={item.question} className="rounded-3xl border bg-card p-6">
                      <h3 className="text-xl font-black">{item.question}</h3>
                      <p className="mt-3 leading-7 text-muted-foreground">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-14 rounded-[2rem] bg-muted/60 p-6 sm:p-8">
              <BookOpen className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-2xl font-black">Πηγές & περαιτέρω ανάγνωση</h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Το άρθρο είναι ενημερωτικό και δεν αντικαθιστά εξατομικευμένη
                ιατρική, αναπτυξιακή ή ψυχολογική αξιολόγηση.
              </p>
              <ul className="mt-5 space-y-3">
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-2 font-bold text-primary hover:underline"
                    >
                      {source.label}
                      <ExternalLink className="mt-1 h-4 w-4 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[2rem] border bg-card p-6 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wider text-primary">
                Σχετικά άρθρα
              </p>
              <div className="mt-5 space-y-5">
                {related.map((item) => (
                  <article key={item.slug}>
                    <span className="text-xs font-bold text-muted-foreground">
                      {item.tag}
                    </span>
                    <h2 className="mt-1 font-black leading-snug">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: item.slug }}
                        className="hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </h2>
                  </article>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-6 w-full rounded-full">
                <Link to="/blog">
                  Όλα τα άρθρα
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        <section className="pb-20">
          <div className="mx-auto max-w-5xl px-4 lg:px-8">
            <div className="rounded-[2.5rem] bg-leaf p-8 sm:p-12">
              <CalendarDays className="h-9 w-9" />
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Οι πληροφορίες βοηθούν. Η επίσκεψη δείχνει την πραγματική καθημερινότητα.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/70">
                Αν εξετάζετε παιδικό σταθμό ή νηπιαγωγείο στον Άγιο Δημήτριο,
                ελάτε να δείτε τον χώρο, την ομάδα και τον τρόπο που λειτουργεί η ημέρα.
              </p>
              <Button asChild size="lg" className="mt-7 rounded-full">
                <Link to="/book-visit">
                  Κλείστε γνωριμία
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </article>
    </SiteLayout>
  );
}
