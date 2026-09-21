import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  try {
    const body = await req.json();
    const parent_name = String(body.parent_name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim() || null;
    const child_age = String(body.child_age || "").trim() || null;
    const message = String(body.message || "").trim() || null;
    const page = String(body.page || "").slice(0, 300) || null;
    const consent = body.gdpr_consent === true;

    if (!parent_name || parent_name.length > 200 || !phone || phone.length > 40 || !consent) {
      return new Response(JSON.stringify({ ok:false, error:"validation" }), { status:400, headers:{...cors,"Content-Type":"application/json"} });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ ok:false, error:"email" }), { status:400, headers:{...cors,"Content-Type":"application/json"} });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, serviceKey);

    const utm = typeof body.utm === "object" && body.utm ? body.utm : {};
    const { data, error } = await supabase.from("pisipouk_leads").insert({
      parent_name, phone, email, child_age, message,
      source: "website", page, utm,
      email_status: "pending"
    }).select("id,created_at").single();
    if (error) throw error;

    let resendKey = Deno.env.get("RESEND_API_KEY") || null;
    if (!resendKey) {
      const { data: vaultKey, error: vaultError } = await supabase.rpc("get_pisipouk_resend_api_key");
      if (!vaultError && typeof vaultKey === "string" && vaultKey.trim()) resendKey = vaultKey.trim();
    }
    let emailStatus = "pending_config";
    let emailError: string | null = null;

    if (resendKey) {
      const safe = (v: unknown) => String(v ?? "").replace(/[<>]/g, "");
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">
          <h2>Νέο αίτημα από το site Πισιπούκ</h2>
          <p><b>Γονέας:</b> ${safe(parent_name)}</p>
          <p><b>Τηλέφωνο:</b> ${safe(phone)}</p>
          <p><b>Email:</b> ${safe(email || "—")}</p>
          <p><b>Ηλικία παιδιού:</b> ${safe(child_age || "—")}</p>
          <p><b>Μήνυμα:</b><br>${safe(message || "—")}</p>
          <p><b>Σελίδα:</b> ${safe(page || "—")}</p>
          <hr>
          <p style="color:#666;font-size:12px">Το αίτημα έχει αποθηκευτεί στη βάση δεδομένων του Pisipouk.</p>
        </div>`;
      const resp = await fetch("https://api.resend.com/emails", {
        method:"POST",
        headers:{ "Authorization":`Bearer ${resendKey}`, "Content-Type":"application/json" },
        body:JSON.stringify({
          from:"Pisipouk Website <notifications@dealora-ai.com>",
          to:["pisipouk@windowslive.com","vmoulakakis@gmail.com"],
          subject:`Νέο ενδιαφέρον γονέα — ${parent_name}`,
          html,
          reply_to: email || undefined
        })
      });
      if (resp.ok) emailStatus = "sent";
      else {
        emailStatus = "failed";
        emailError = (await resp.text()).slice(0,1000);
      }
    }

    await supabase.from("pisipouk_leads").update({ email_status:emailStatus, email_error:emailError }).eq("id", data.id);

    return new Response(JSON.stringify({ ok:true, id:data.id, email_status:emailStatus }), {
      status:200, headers:{...cors,"Content-Type":"application/json"}
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok:false, error:"server" }), { status:500, headers:{...cors,"Content-Type":"application/json"} });
  }
});