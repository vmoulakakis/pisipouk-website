const SUPABASE_URL = "https://gqpbskssrvpfjtujwezc.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_Kcat2PHVjGn32ubiefotfA_iJjCU-B2";
const INTERNAL_TRAFFIC_KEY = "pisipouk_internal_traffic";

function ids() {
  const get = (key:string) => {
    let v = localStorage.getItem(key);
    if (!v) { v = crypto.randomUUID(); localStorage.setItem(key,v); }
    return v;
  };
  return { session_id:get("pisipouk_session_id"), visitor_id:get("pisipouk_visitor_id") };
}

function utm() {
  const p=new URLSearchParams(location.search);
  return {
    utm_source:p.get("utm_source"),
    utm_medium:p.get("utm_medium"),
    utm_campaign:p.get("utm_campaign")
  };
}

export function isAnalyticsExcluded() {
  try { return localStorage.getItem(INTERNAL_TRAFFIC_KEY) === "1"; }
  catch { return false; }
}

export async function excludeThisBrowserFromAnalytics() {
  try {
    const {session_id,visitor_id}=ids();
    await fetch(`${SUPABASE_URL}/functions/v1/pisipouk-event`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":PUBLISHABLE_KEY},
      body:JSON.stringify({session_id,visitor_id,event_type:"internal_optout"}),
      keepalive:true
    });
  } finally {
    try { localStorage.setItem(INTERNAL_TRAFFIC_KEY,"1"); } catch {}
  }
}

export function includeThisBrowserInAnalytics() {
  try { localStorage.removeItem(INTERNAL_TRAFFIC_KEY); } catch {}
}

export async function trackEvent(event_type:string, metadata:Record<string,unknown>={}) {
  try {
    if (isAnalyticsExcluded()) return;
    const {session_id,visitor_id}=ids();
    const u=utm();
    await fetch(`${SUPABASE_URL}/functions/v1/pisipouk-event`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":PUBLISHABLE_KEY},
      body:JSON.stringify({
        session_id,visitor_id,event_type,
        path:location.pathname+location.search,
        referrer:document.referrer || null,
        ...u,metadata
      }),
      keepalive:true
    });
  } catch {}
}

export async function submitLead(input:{
  parent_name:string; phone:string; email?:string; child_age?:string;
  message?:string; gdpr_consent:boolean; page?:string;
}) {
  const p=new URLSearchParams(location.search);
  const res=await fetch(`${SUPABASE_URL}/functions/v1/pisipouk-lead`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":PUBLISHABLE_KEY},
    body:JSON.stringify({
      ...input,
      page:input.page || location.pathname,
      utm:{source:p.get("utm_source"),medium:p.get("utm_medium"),campaign:p.get("utm_campaign")}
    })
  });
  const data=await res.json().catch(()=>({}));
  if(!res.ok || !data.ok) throw new Error(data.error || "lead_failed");
  return data as {ok:true;id:string;email_status:string};
}

export { SUPABASE_URL, PUBLISHABLE_KEY };
