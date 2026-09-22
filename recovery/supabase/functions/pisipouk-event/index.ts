import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods":"POST, OPTIONS"
};

const allowed=new Set([
  "page_view","phone_click","viber_click","email_click",
  "form_start","form_submit","form_success","form_error",
  "visit_click","share_click","blog_click"
]);

const firstHeader = (req:Request, names:string[]) => {
  for (const name of names) {
    const v=req.headers.get(name);
    if (v && v.trim()) {
      try { return decodeURIComponent(v.trim()).slice(0,150); }
      catch { return v.trim().slice(0,150); }
    }
  }
  return null;
};

const clientIp = (req:Request) => {
  const xff=req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ||
         req.headers.get("fly-client-ip") ||
         req.headers.get("x-real-ip") ||
         "";
};

async function hmacSha256(value:string, secret:string) {
  if (!value) return null;
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey(
    "raw", enc.encode(secret),
    {name:"HMAC",hash:"SHA-256"},
    false, ["sign"]
  );
  const sig=await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST") return new Response("Method not allowed",{status:405,headers:cors});

  try{
    const b=await req.json();
    const event_type=String(b.event_type||"");
    const session_id=String(b.session_id||"").slice(0,120);
    const visitor_id=String(b.visitor_id||"").slice(0,120) || null;

    const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const s=createClient(Deno.env.get("SUPABASE_URL")!,serviceKey);

    const ip=clientIp(req);
    const network_hash=await hmacSha256(ip,serviceKey);

    if(event_type==="internal_optout"){
      if(!visitor_id) {
        return new Response(JSON.stringify({ok:false,error:"missing_visitor"}),{
          status:400,headers:{...cors,"Content-Type":"application/json"}
        });
      }
      const {error}=await s.from("pisipouk_internal_visitors").upsert({
        visitor_id,
        excluded_at:new Date().toISOString()
      });
      if(error) throw error;
      return new Response(JSON.stringify({ok:true,excluded:true}),{
        headers:{...cors,"Content-Type":"application/json"}
      });
    }

    if(!allowed.has(event_type)||!session_id) {
      return new Response(JSON.stringify({ok:false}),{
        status:400,headers:{...cors,"Content-Type":"application/json"}
      });
    }

    if(visitor_id){
      const {data:internal}=await s.from("pisipouk_internal_visitors")
        .select("visitor_id").eq("visitor_id",visitor_id).maybeSingle();
      if(internal){
        return new Response(JSON.stringify({ok:true,skipped:"internal"}),{
          headers:{...cors,"Content-Type":"application/json"}
        });
      }
    }

    const country=firstHeader(req,[
      "cf-ipcountry","x-vercel-ip-country","x-country-code","x-geo-country"
    ]);
    const region=firstHeader(req,[
      "x-vercel-ip-country-region","cf-region","x-geo-region"
    ]);
    const city=firstHeader(req,[
      "x-vercel-ip-city","cf-ipcity","x-geo-city"
    ]);

    const {error}=await s.from("pisipouk_events").insert({
      session_id,
      visitor_id,
      event_type,
      path:String(b.path||"").slice(0,300)||null,
      referrer:String(b.referrer||"").slice(0,500)||null,
      utm_source:String(b.utm_source||"").slice(0,150)||null,
      utm_medium:String(b.utm_medium||"").slice(0,150)||null,
      utm_campaign:String(b.utm_campaign||"").slice(0,150)||null,
      metadata:typeof b.metadata==="object"&&b.metadata?b.metadata:{},
      network_hash,
      country,
      region,
      city
    });
    if(error) throw error;

    return new Response(JSON.stringify({ok:true}),{
      headers:{...cors,"Content-Type":"application/json"}
    });
  }catch(e){
    console.error(e);
    return new Response(JSON.stringify({ok:false}),{
      status:500,headers:{...cors,"Content-Type":"application/json"}
    });
  }
});