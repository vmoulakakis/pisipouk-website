import { createFileRoute, Link } from "@tanstack/react-router";
import { useLanguage } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, MessageCircle, Star } from "lucide-react";
import { trackEvent } from "@/lib/pisipoukApi";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJp2TdCdC9oRQR4_25R-evEqE";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Αξιολόγηση Google | Ο Πισιπούκ" },
      {
        name: "description",
        content:
          "Μοιραστείτε την εμπειρία σας από τον Πισιπούκ με μια ειλικρινή αξιολόγηση στο Google.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { lang } = useLanguage();
  const gr = lang === "gr";

  const openReview = async () => {
    await trackEvent("share_click", { placement: "reviews_page_google" });
    window.open(GOOGLE_REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <SiteLayout>
      <section className="hero-field py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-sun text-sun-foreground">
            <Star className="h-8 w-8 fill-current" />
          </span>

          <p className="section-kicker mt-6">
            {gr ? "Η γνώμη σας μετράει" : "Your feedback matters"}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            {gr
              ? "Μοιραστείτε την εμπειρία σας από τον Πισιπούκ"
              : "Share your experience with O Pisipouk"}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {gr
              ? "Μια ειλικρινής αξιολόγηση βοηθά άλλες οικογένειες να γνωρίσουν καλύτερα τον σταθμό και βοηθά κι εμάς να γινόμαστε καλύτεροι."
              : "An honest review helps other families understand our school and helps us keep improving."}
          </p>

          <Button
            type="button"
            size="lg"
            onClick={openReview}
            className="mt-8 rounded-full px-7"
          >
            <Star className="h-5 w-5" />
            {gr ? "Γράψτε αξιολόγηση στο Google" : "Write a Google review"}
            <ExternalLink className="h-4 w-4" />
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            {gr
              ? "Θέλουμε την πραγματική σας εμπειρία — θετική, ουδέτερη ή αρνητική."
              : "We welcome your genuine experience — positive, neutral or negative."}
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2 lg:px-8">
          <div className="rounded-[2rem] border bg-card p-7 shadow-sm">
            <Heart className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-black">
              {gr ? "Τι είναι χρήσιμο να γράψετε" : "What is useful to mention"}
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {gr
                ? "Μπορείτε να αναφέρετε την προσαρμογή του παιδιού, την επικοινωνία με την ομάδα, το πρόγραμμα, τον χώρο ή οτιδήποτε θεωρείτε σημαντικό για μια άλλη οικογένεια."
                : "You can mention settling-in, communication with the team, the program, the space, or anything you think another family should know."}
            </p>
          </div>

          <div className="rounded-[2rem] border bg-card p-7 shadow-sm">
            <MessageCircle className="h-8 w-8 text-primary" />
            <h2 className="mt-4 text-2xl font-black">
              {gr ? "Θέλετε να μας μιλήσετε πρώτα;" : "Would you like to speak with us first?"}
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {gr
                ? "Αν υπάρχει κάτι που θέλετε να συζητήσουμε ή να βελτιώσουμε, μπορείτε παράλληλα να επικοινωνήσετε απευθείας μαζί μας."
                : "If there is something you would like us to discuss or improve, you can also contact us directly."}
            </p>
            <Button asChild variant="outline" className="mt-5 rounded-full">
              <Link to="/contact">
                {gr ? "Επικοινωνία με τον Πισιπούκ" : "Contact O Pisipouk"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
