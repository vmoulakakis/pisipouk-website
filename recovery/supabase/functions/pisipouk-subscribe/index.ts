import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const out = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

const clean = (v: unknown, max = 300) =>
  String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);

const esc = (v: unknown) => String(v ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return out({ ok: false, error: "method_not_allowed" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const action = clean(body.action || "subscribe", 40);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    if (action === "unsubscribe") {
      const token = clean(body.token, 80);
      if (!token) return out({ ok: false, error: "missing_token" }, 400);

      const { data, error } = await supabase
        .from("pisipouk_subscribers")
        .update({
          status: "unsubscribed",
          unsubscribed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("unsubscribe_token", token)
        .select("id")
        .maybeSingle();

      if (error) throw error;
      return out({ ok: true, unsubscribed: !!data });
    }

    const email = clean(body.email, 180).toLowerCase();
    const firstName = clean(body.first_name, 100) || null;
    const consent = body.consent === true;
    const source = clean(body.source || "website", 80) || "website";
    const utm = typeof body.utm === "object" && body.utm ? body.utm : {};

    if (!consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return out({ ok: false, error: "validation" }, 400);
    }

    const { data: existing, error: findError } = await supabase
      .from("pisipouk_subscribers")
      .select("id,unsubscribe_token,status")
      .eq("email", email)
      .maybeSingle();
    if (findError) throw findError;

    let subscriber: any;
    let shouldSendWelcome = true;

    if (existing) {
      shouldSendWelcome = existing.status !== "active";
      const { data, error } = await supabase
        .from("pisipouk_subscribers")
        .update({
          first_name: firstName,
          status: "active",
          source,
          utm,
          consent_at: new Date().toISOString(),
          unsubscribed_at: null,
          updated_at: new Date().toISOString(),
          ...(shouldSendWelcome ? {
            welcome_email_status: "pending",
            welcome_email_error: null,
          } : {}),
        })
        .eq("id", existing.id)
        .select("id,unsubscribe_token")
        .single();
      if (error) throw error;
      subscriber = data;

      if (!shouldSendWelcome) {
        return out({ ok: true, email_status: "already_subscribed" });
      }
    } else {
      const { data, error } = await supabase
        .from("pisipouk_subscribers")
        .insert({
          email,
          first_name: firstName,
          source,
          utm,
          status: "active",
          welcome_email_status: "pending",
        })
        .select("id,unsubscribe_token")
        .single();
      if (error) throw error;
      subscriber = data;
    }

    let resendKey = Deno.env.get("RESEND_API_KEY") || null;
    if (!resendKey) {
      const { data: vaultKey, error: vaultError } =
        await supabase.rpc("get_pisipouk_resend_api_key");
      if (!vaultError && typeof vaultKey === "string" && vaultKey.trim()) {
        resendKey = vaultKey.trim();
      }
    }

    let emailStatus = "pending_config";
    let emailError: string | null = null;

    if (resendKey) {
      const unsubscribeUrl =
        "https://pisipouk.vercel.app/unsubscribe?token=" +
        encodeURIComponent(String(subscriber.unsubscribe_token));
      const name = firstName ? ` ${esc(firstName)}` : "";

      const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:auto;color:#17324d;line-height:1.6">
        <p style="font-size:14px;color:#64748b">Ο Πισιπούκ · Parent Notes</p>
        <h1 style="font-size:30px;line-height:1.15;margin:10px 0 16px">Καλώς ήρθατε${name} 👋</h1>
        <p>Σας υποσχεθήκαμε κάτι χρήσιμο — όχι προσφορά.</p>
        <p><strong>Ο μικρός οδηγός 7 ημερών για πιο ήρεμη προσαρμογή στον παιδικό σταθμό:</strong></p>

        <div style="background:#fff8df;border-radius:20px;padding:20px;margin:22px 0">
          <p><strong>Ημέρα 1:</strong> Μικρός, καθαρός αποχαιρετισμός. Όχι παρατεταμένη αναχώρηση.</p>
          <p><strong>Ημέρα 2:</strong> Ίδια πρωινή ρουτίνα, ώστε το παιδί να ξέρει τι ακολουθεί.</p>
          <p><strong>Ημέρα 3:</strong> Ρωτήστε για μία συγκεκριμένη όμορφη στιγμή της ημέρας.</p>
          <p><strong>Ημέρα 4:</strong> Μην πιέζετε για πολλές λεπτομέρειες όταν γυρίζει σπίτι.</p>
          <p><strong>Ημέρα 5:</strong> Συνδέστε το σχολείο με κάτι οικείο: ένα τραγούδι, μια ιστορία, ένα μικρό τελετουργικό.</p>
          <p><strong>Ημέρα 6:</strong> Παρατηρήστε ύπνο, όρεξη και διάθεση — η προσαρμογή δεν φαίνεται μόνο στο κλάμα.</p>
          <p><strong>Ημέρα 7:</strong> Μιλήστε με τον παιδαγωγό για την πραγματική εικόνα, όχι μόνο για το πώς ήταν η είσοδος.</p>
        </div>

        <p><strong>3 ερωτήσεις που αξίζει να κάνετε σε κάθε παιδικό σταθμό:</strong></p>
        <ol>
          <li>Πώς χειρίζεστε την περίοδο προσαρμογής;</li>
          <li>Πώς ενημερώνεται ο γονιός για την καθημερινότητα του παιδιού;</li>
          <li>Πώς ανταποκρίνεστε όταν ένα παιδί δυσκολεύεται συναισθηματικά;</li>
        </ol>

        <p style="margin-top:24px">Στα επόμενα Parent Notes θα στέλνουμε σύντομα, πρακτικά θέματα για προσαρμογή, ανάπτυξη, καθημερινότητα, voucher και επιλογή παιδικού — χωρίς καθημερινό spam.</p>

        <p style="margin-top:28px">
          <a href="https://pisipouk.vercel.app/book-visit" style="display:inline-block;background:#17324d;color:white;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:bold">
            Γνωρίστε τον Πισιπούκ από κοντά
          </a>
        </p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0 18px">
        <p style="font-size:12px;color:#64748b">
          Λαμβάνετε αυτό το email επειδή εγγραφήκατε στα Parent Notes του Πισιπούκ.
          <a href="${unsubscribeUrl}" style="color:#64748b">Διαγραφή από τη λίστα</a>.
        </p>
      </div>`;

      const text = `Καλώς ήρθατε στα Parent Notes του Πισιπούκ.

Ο μικρός οδηγός 7 ημερών για πιο ήρεμη προσαρμογή:
1. Μικρός, καθαρός αποχαιρετισμός.
2. Ίδια πρωινή ρουτίνα.
3. Ρωτήστε για μία συγκεκριμένη όμορφη στιγμή.
4. Μην πιέζετε για πολλές λεπτομέρειες.
5. Συνδέστε το σχολείο με κάτι οικείο.
6. Παρατηρήστε ύπνο, όρεξη και διάθεση.
7. Μιλήστε με τον παιδαγωγό για την πραγματική εικόνα.

Θα στέλνουμε σύντομα, πρακτικά Parent Notes χωρίς καθημερινό spam.

Διαγραφή: ${unsubscribeUrl}`;

      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Ο Πισιπούκ <notifications@dealora-ai.com>",
          to: [email],
          subject: "Ο οδηγός 7 ημερών για πιο ήρεμη προσαρμογή 🌱",
          html,
          text,
          reply_to: "pisipouk@windowslive.com",
        }),
      });

      if (resp.ok) {
        emailStatus = "sent";
      } else {
        emailStatus = "failed";
        emailError = (await resp.text()).slice(0, 1000);
      }
    }

    await supabase
      .from("pisipouk_subscribers")
      .update({
        welcome_email_status: emailStatus,
        welcome_email_error: emailError,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    return out({ ok: true, email_status: emailStatus });
  } catch (e) {
    console.error(e);
    return out({ ok: false, error: "server" }, 500);
  }
});
