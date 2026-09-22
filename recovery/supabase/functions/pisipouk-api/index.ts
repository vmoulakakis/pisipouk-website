import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const out = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: cors });

const sha256 = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const randomToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const getBearer = (req: Request) => {
  const h = req.headers.get("authorization") || "";
  return h.toLowerCase().startsWith("bearer ") ? h.slice(7).trim() : "";
};

const requireAdmin = async (req: Request) => {
  const token = getBearer(req);
  if (!token) return null;
  const tokenHash = await sha256(token);
  const { data } = await supabase
    .from("pisipouk_admin_sessions")
    .select("id,expires_at")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data) return null;
  await supabase.from("pisipouk_admin_sessions")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", data.id);
  return data;
};

const bodyJson = async (req: Request) => {
  try { return await req.json(); } catch { return {}; }
};

const clean = (v: unknown, max = 2000) =>
  String(v ?? "").replace(/[<>]/g, "").trim().slice(0, max);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);
  const b = req.method === "POST" ? await bodyJson(req) : {};
  const action = clean(url.searchParams.get("action") || b.action || "", 80);

  try {
    if (action === "public_settings") {
      const { data, error } = await supabase.from("pisipouk_settings")
        .select("key,value").eq("is_public", true);
      if (error) throw error;
      return out({ settings: Object.fromEntries((data || []).map(x => [x.key, x.value])) });
    }

    if (action === "public_reviews") {
      const { data, error } = await supabase.from("pisipouk_reviews")
        .select("id,source,source_url,reviewer_name,rating,review_text,review_date,verified,is_featured")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("review_date", { ascending: false });
      if (error) throw error;
      return out({ reviews: data || [] });
    }

    if (action === "contact") {
      if (req.method !== "POST") return out({ error: "method_not_allowed" }, 405);
      const company = clean(b.company, 200);
      if (company) return out({ ok: true });
      const name = clean(b.name, 120);
      const phone = clean(b.phone, 60);
      const email = clean(b.email, 180);
      const childAge = clean(b.child_age, 40);
      const preferred = clean(b.preferred_contact, 40);
      const message = clean(b.message, 2500);
      const consent = b.consent === true || b.consent === "yes";
      if (name.length < 2 || phone.length < 6 || !consent) {
        return out({ error: "Συμπληρώστε όνομα, τηλέφωνο και συγκατάθεση." }, 400);
      }
      const { data, error } = await supabase.from("pisipouk_messages").insert({
        name, phone, email: email || null, child_age: childAge || null,
        preferred_contact: preferred || null, message: message || null,
        consent, source: clean(b.source || "website", 80),
        utm_source: clean(b.utm_source, 100) || null,
        utm_medium: clean(b.utm_medium, 100) || null,
        utm_campaign: clean(b.utm_campaign, 150) || null,
      }).select("id").single();
      if (error) throw error;

      // Best-effort immediate email notification. The database write above remains
      // the source of truth, so an email-provider issue can never lose the lead.
      try {
        let resendKey = Deno.env.get("RESEND_API_KEY") || null;
        if (!resendKey) {
          const { data: vaultKey, error: vaultError } = await supabase.rpc("get_pisipouk_resend_api_key");
          if (!vaultError && typeof vaultKey === "string" && vaultKey.trim()) resendKey = vaultKey.trim();
        }
        if (resendKey) {
          const now = new Date();
          const todayStart = new Date(now);
          todayStart.setUTCHours(0, 0, 0, 0);
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

          const [pageViewsRes, sessionsRes, formSuccessRes, todayMessagesRes, weekMessagesRes, openMessagesRes] = await Promise.all([
            supabase.from("pisipouk_events").select("*", { count: "exact", head: true }).eq("event_type", "page_view").gte("created_at", todayStart.toISOString()),
            supabase.from("pisipouk_events").select("session_id").eq("event_type", "page_view").gte("created_at", todayStart.toISOString()).limit(5000),
            supabase.from("pisipouk_events").select("*", { count: "exact", head: true }).eq("event_type", "form_success").gte("created_at", todayStart.toISOString()),
            supabase.from("pisipouk_messages").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
            supabase.from("pisipouk_messages").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
            supabase.from("pisipouk_messages").select("*", { count: "exact", head: true }).eq("status", "new").eq("archived", false),
          ]);

          const esc = (v: unknown) => String(v ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
          const uniqueToday = new Set((sessionsRes.data || []).map((x: any) => x.session_id).filter(Boolean)).size;
          const validReplyTo = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) ? email : undefined;

          const html = `
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:auto;color:#10264A">
              <h2 style="margin-bottom:8px">Νέο μήνυμα από το site Πισιπούκ</h2>
              <p style="margin-top:0;color:#64748B">Το μήνυμα έχει ήδη αποθηκευτεί με ασφάλεια στη βάση.</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0">
                <tr><td style="padding:8px 0"><b>Όνομα</b></td><td>${esc(name)}</td></tr>
                <tr><td style="padding:8px 0"><b>Τηλέφωνο</b></td><td>${esc(phone)}</td></tr>
                <tr><td style="padding:8px 0"><b>Email</b></td><td>${esc(email || "—")}</td></tr>
                <tr><td style="padding:8px 0"><b>Ηλικία παιδιού</b></td><td>${esc(childAge || "—")}</td></tr>
                <tr><td style="padding:8px 0"><b>Μήνυμα</b></td><td>${esc(message || "—")}</td></tr>
                <tr><td style="padding:8px 0"><b>UTM source</b></td><td>${esc(clean(b.utm_source, 100) || "—")}</td></tr>
                <tr><td style="padding:8px 0"><b>UTM campaign</b></td><td>${esc(clean(b.utm_campaign, 150) || "—")}</td></tr>
              </table>
              <h3 style="margin:26px 0 10px">Στατιστικά site</h3>
              <table style="width:100%;border-collapse:collapse;background:#F6F8FB">
                <tr><td style="padding:10px"><b>Pageviews σήμερα</b></td><td style="padding:10px">${pageViewsRes.count || 0}</td></tr>
                <tr><td style="padding:10px"><b>Μοναδικές συνεδρίες σήμερα</b></td><td style="padding:10px">${uniqueToday}</td></tr>
                <tr><td style="padding:10px"><b>Επιτυχημένες φόρμες σήμερα</b></td><td style="padding:10px">${formSuccessRes.count || 0}</td></tr>
                <tr><td style="padding:10px"><b>Μηνύματα σήμερα</b></td><td style="padding:10px">${todayMessagesRes.count || 0}</td></tr>
                <tr><td style="padding:10px"><b>Μηνύματα τελευταίων 7 ημερών</b></td><td style="padding:10px">${weekMessagesRes.count || 0}</td></tr>
                <tr><td style="padding:10px"><b>Ανοιχτά νέα μηνύματα</b></td><td style="padding:10px">${openMessagesRes.count || 0}</td></tr>
              </table>
              <p style="margin-top:22px;color:#64748B;font-size:12px">Pisipouk website notification · ${esc(now.toISOString())}</p>
            </div>`;

          const resp = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Pisipouk Website <notifications@dealora-ai.com>",
              to: ["pisipouk@windowslive.com", "vmoulakakis@gmail.com"],
              subject: `Νέο μήνυμα Πισιπούκ — ${name}`,
              html,
              reply_to: validReplyTo,
            }),
          });

          if (!resp.ok) console.error("Pisipouk contact email failed:", (await resp.text()).slice(0, 1000));
        } else {
          console.warn("Pisipouk contact email skipped: RESEND_API_KEY is not configured");
        }
      } catch (notifyError) {
        console.error("Pisipouk contact notification error:", notifyError);
      }

      return out({ ok: true, id: data.id });
    }

    if (action === "admin_login") {
      if (req.method !== "POST") return out({ error: "method_not_allowed" }, 405);
      const password = clean(b.password, 300);
      const { data: creds, error } = await supabase.from("pisipouk_admin_credentials")
        .select("salt,password_hash").eq("id", 1).single();
      if (error || !creds) return out({ error: "admin_not_configured" }, 500);
      const candidate = await sha256(creds.salt + password);
      if (candidate !== creds.password_hash) {
        await supabase.from("pisipouk_admin_audit").insert({ action: "login_failed", details: {} });
        return out({ error: "Λάθος κωδικός." }, 401);
      }
      const token = randomToken();
      const tokenHash = await sha256(token);
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("pisipouk_admin_sessions").delete().lt("expires_at", new Date().toISOString());
      const { error: sErr } = await supabase.from("pisipouk_admin_sessions")
        .insert({ token_hash: tokenHash, expires_at: expires });
      if (sErr) throw sErr;
      await supabase.from("pisipouk_admin_audit").insert({ action: "login_success", details: {} });
      return out({ ok: true, token, expires_at: expires });
    }

    const admin = await requireAdmin(req);
    if (!admin) return out({ error: "unauthorized" }, 401);

    if (action === "admin_logout") {
      const tokenHash = await sha256(getBearer(req));
      await supabase.from("pisipouk_admin_sessions").delete().eq("token_hash", tokenHash);
      return out({ ok: true });
    }

    if (action === "admin_stats") {
      const { data: messages, error } = await supabase.from("pisipouk_messages")
        .select("status,created_at,archived");
      if (error) throw error;
      const rows = messages || [];
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 3600 * 1000;
      const stats = {
        total: rows.filter(x => !x.archived).length,
        new: rows.filter(x => !x.archived && x.status === "new").length,
        appointments: rows.filter(x => !x.archived && x.status === "appointment").length,
        enrolled: rows.filter(x => !x.archived && x.status === "enrolled").length,
        last7days: rows.filter(x => new Date(x.created_at).getTime() >= weekAgo).length,
      };
      return out({ stats });
    }

    if (action === "admin_messages") {
      const status = clean(url.searchParams.get("status"), 40);
      let q = supabase.from("pisipouk_messages").select("*")
        .order("created_at", { ascending: false }).limit(500);
      if (status && status !== "all") q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;
      return out({ messages: data || [] });
    }

    if (action === "admin_update_message") {
      const id = clean(b.id, 80);
      const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (b.status) patch.status = clean(b.status, 40);
      if (b.admin_notes !== undefined) patch.admin_notes = clean(b.admin_notes, 5000);
      if (b.follow_up_at !== undefined) patch.follow_up_at = b.follow_up_at || null;
      if (b.last_contacted_at !== undefined) patch.last_contacted_at = b.last_contacted_at || null;
      if (b.archived !== undefined) patch.archived = !!b.archived;
      const { error } = await supabase.from("pisipouk_messages").update(patch).eq("id", id);
      if (error) throw error;
      await supabase.from("pisipouk_admin_audit").insert({ action: "message_updated", entity_type: "message", entity_id: id, details: patch });
      return out({ ok: true });
    }

    if (action === "admin_delete_message") {
      const id = clean(b.id, 80);
      const { error } = await supabase.from("pisipouk_messages").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("pisipouk_admin_audit").insert({ action: "message_deleted", entity_type: "message", entity_id: id });
      return out({ ok: true });
    }

    if (action === "admin_reviews") {
      const { data, error } = await supabase.from("pisipouk_reviews").select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return out({ reviews: data || [] });
    }

    if (action === "admin_save_review") {
      const row = {
        source: clean(b.source || "google", 60),
        source_url: clean(b.source_url, 800) || null,
        external_id: clean(b.external_id, 160) || null,
        reviewer_name: clean(b.reviewer_name, 160) || null,
        rating: Math.max(1, Math.min(5, Number(b.rating || 5))),
        review_text: clean(b.review_text, 3000) || null,
        review_date: b.review_date || null,
        verified: !!b.verified,
        is_featured: !!b.is_featured,
        is_published: !!b.is_published,
        updated_at: new Date().toISOString(),
      };
      if (b.id) {
        const { error } = await supabase.from("pisipouk_reviews").update(row).eq("id", clean(b.id, 80));
        if (error) throw error;
      } else {
        const { error } = await supabase.from("pisipouk_reviews").insert(row);
        if (error) throw error;
      }
      return out({ ok: true });
    }

    if (action === "admin_delete_review") {
      const { error } = await supabase.from("pisipouk_reviews").delete().eq("id", clean(b.id, 80));
      if (error) throw error;
      return out({ ok: true });
    }

    if (action === "admin_settings") {
      if (req.method === "GET") {
        const { data, error } = await supabase.from("pisipouk_settings").select("*").order("key");
        if (error) throw error;
        return out({ settings: data || [] });
      }
      const key = clean(b.key, 100);
      if (!key) return out({ error: "missing_key" }, 400);
      const { error } = await supabase.from("pisipouk_settings").upsert({
        key, value: b.value ?? {}, is_public: b.is_public !== false, updated_at: new Date().toISOString()
      });
      if (error) throw error;
      return out({ ok: true });
    }

    if (action === "admin_change_password") {
      const newPassword = clean(b.new_password, 300);
      if (newPassword.length < 14) return out({ error: "Ο νέος κωδικός πρέπει να έχει τουλάχιστον 14 χαρακτήρες." }, 400);
      const salt = crypto.randomUUID().replaceAll("-", "");
      const hash = await sha256(salt + newPassword);
      const { error } = await supabase.from("pisipouk_admin_credentials")
        .update({ salt, password_hash: hash, updated_at: new Date().toISOString() }).eq("id", 1);
      if (error) throw error;
      await supabase.from("pisipouk_admin_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      return out({ ok: true, relogin: true });
    }

    return out({ error: "unknown_action" }, 404);
  } catch (e) {
    console.error(e);
    return out({ error: "server_error" }, 500);
  }
});