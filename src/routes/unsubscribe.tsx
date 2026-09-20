import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { unsubscribeParentNotes } from "@/lib/pisipoukApi";

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Διαγραφή από Parent Notes | Ο Πισιπούκ" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const [state, setState] = useState<"loading" | "done" | "error">("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!token) {
      setState("error");
      return;
    }

    unsubscribeParentNotes(token)
      .then(() => setState("done"))
      .catch(() => setState("error"));
  }, []);

  return (
    <SiteLayout>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-xl px-4 text-center">
          {state === "loading" && (
            <>
              <h1 className="text-4xl font-black">Επεξεργασία διαγραφής…</h1>
              <p className="mt-4 text-muted-foreground">Ένα λεπτό μόνο.</p>
            </>
          )}

          {state === "done" && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-5 text-4xl font-black">Έγινε η διαγραφή.</h1>
              <p className="mt-4 leading-7 text-muted-foreground">
                Δεν θα λαμβάνετε άλλα Parent Notes σε αυτό το email.
              </p>
              <Button asChild className="mt-7 rounded-full">
                <Link to="/">Επιστροφή στον Πισιπούκ</Link>
              </Button>
            </>
          )}

          {state === "error" && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="mt-5 text-4xl font-black">Δεν μπορέσαμε να ολοκληρώσουμε τη διαγραφή.</h1>
              <p className="mt-4 leading-7 text-muted-foreground">
                Ο σύνδεσμος μπορεί να μην είναι έγκυρος. Επικοινωνήστε μαζί μας και θα το τακτοποιήσουμε.
              </p>
              <Button asChild variant="outline" className="mt-7 rounded-full">
                <Link to="/contact">Επικοινωνία</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
