import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"GET, OPTIONS"};
Deno.serve(async(req:Request)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  const auth=req.headers.get("Authorization");
  if(!auth) return new Response("Unauthorized",{status:401,headers:cors});
  try{
    const url=Deno.env.get("SUPABASE_URL")!;
    const anon=Deno.env.get("SUPABASE_ANON_KEY")!;
    const service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
    const {data:{user}}=await userClient.auth.getUser();
    if(!user) return new Response("Unauthorized",{status:401,headers:cors});
    const s=createClient(url,service);
    const {data:admin}=await s.from("pisipouk_admins").select("active").eq("user_id",user.id).eq("active",true).maybeSingle();
    if(!admin) return new Response("Forbidden",{status:403,headers:cors});

    const since=new Date(Date.now()-30*86400000).toISOString();
    const [{data:leads},{data:events},{data:daily}]=await Promise.all([
      s.from("pisipouk_leads").select("*").order("created_at",{ascending:false}).limit(200),
      s.from("pisipouk_events").select("event_type,session_id,created_at,utm_source,utm_medium,utm_campaign,path").gte("created_at",since).limit(10000),
      s.from("pisipouk_daily_stats").select("*").limit(30)
    ]);
    const ev=events||[];
    const sessions=new Set(ev.filter((x:any)=>x.event_type==="page_view").map((x:any)=>x.session_id)).size;
    const pageViews=ev.filter((x:any)=>x.event_type==="page_view").length;
    const conversions=ev.filter((x:any)=>["phone_click","viber_click","email_click","form_success","visit_click"].includes(x.event_type)).length;
    const sources:Record<string,number>={};
    ev.forEach((x:any)=>{const k=x.utm_source||"direct";sources[k]=(sources[k]||0)+1});
    return new Response(JSON.stringify({ok:true,summary:{sessions,pageViews,conversions,leads:(leads||[]).length},daily:daily||[],leads:leads||[],sources}),{headers:{...cors,"Content-Type":"application/json"}});
  }catch(e){console.error(e);return new Response("Server error",{status:500,headers:cors})}
});