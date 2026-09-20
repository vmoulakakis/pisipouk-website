import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Mail, Sprout } from "lucide-react";
import { subscribeParentNotes } from "@/lib/pisipoukApi";

export function ParentNotesSignup({
  lang,
  source = "website",
}: {
  lang: "gr" | "en";
  source?: string;
}) {
  const gr = lang === "gr";
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !consent) {
      setState("error");
      return;
    }

    setState("sending");
    try {
      await subscribeParentNotes({
        email,
        first_name: firstName,
        consent,
        source,
      });
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="rounded-[2rem] bg-leaf p-7 text-center">
        <CheckCircle2 className="mx-auto h-11 w-11" />
        <h3 className="mt-4 text-2xl font-black">
          {gr ? "Ο οδηγός είναι καθ’ οδόν." : "Your guide is on the way."}
        </h3>
        <p className="mt-2 leading-7">
          {gr
            ? "Ελέγξτε το email σας για τον οδηγό 7 ημερών και τα Parent Notes του Πισιπούκ."
            : "Check your email for the 7-day guide and Pisipouk Parent Notes."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun text-sun-foreground">
          <Sprout className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-black uppercase tracking-[.14em] text-primary">
            Parent Notes
          </p>
          <h3 className="mt-1 text-2xl font-black">
            {gr
              ? "Δωρεάν οδηγός: 7 ημέρες για πιο ήρεμη προσαρμογή"
              : "Free guide: 7 days for a calmer preschool transition"}
          </h3>
        </div>
      </div>

      <p className="leading-7 text-muted-foreground">
        {gr
          ? "Πρακτικές κινήσεις για την πρώτη εβδομάδα, 3 ερωτήσεις που αξίζει να κάνετε σε κάθε παιδικό σταθμό και περιοδικά Parent Notes για γονείς. Χωρίς εκπτώσεις και χωρίς καθημερινό spam."
          : "Practical steps for the first week, 3 questions worth asking any preschool, plus occasional Parent Notes. No discounts and no daily spam."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`parent-notes-name-${source}`}>
            {gr ? "Μικρό όνομα (προαιρετικό)" : "First name (optional)"}
          </Label>
          <Input
            id={`parent-notes-name-${source}`}
            className="mt-1.5"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            autoComplete="given-name"
          />
        </div>
        <div>
          <Label htmlFor={`parent-notes-email-${source}`}>Email *</Label>
          <Input
            id={`parent-notes-email-${source}`}
            className="mt-1.5"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="name@example.com"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-muted/55 p-3 text-sm leading-6">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(Boolean(v))}
          className="mt-1"
        />
        <span>
          {gr
            ? "Συμφωνώ να λαμβάνω το Parent Notes του Πισιπούκ στο email μου. Μπορώ να διαγραφώ οποιαδήποτε στιγμή από τον σύνδεσμο σε κάθε email."
            : "I agree to receive Pisipouk Parent Notes by email. I can unsubscribe at any time using the link in every email."}
        </span>
      </label>

      {state === "error" && (
        <p className="text-sm font-bold text-destructive">
          {gr
            ? "Συμπληρώστε έγκυρο email και επιλέξτε τη συγκατάθεση."
            : "Enter a valid email and provide consent."}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full"
        disabled={state === "sending"}
      >
        <Mail className="h-5 w-5" />
        {state === "sending"
          ? gr
            ? "Αποστολή..."
            : "Sending..."
          : gr
            ? "Στείλτε μου τον οδηγό"
            : "Send me the guide"}
      </Button>
    </form>
  );
}
