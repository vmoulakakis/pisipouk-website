import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { SUPABASE_URL, PUBLISHABLE_KEY } from "@/lib/pisipoukApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, MousePointerClick, Users, UserPlus, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head:()=>({meta:[{title:"Pisipouk Admin"}]}),
  component:AdminPage
});

type Data={
  summary:{sessions:number;pageViews:number;conversions:number;leads:number};
  daily:Array<{day:string;page_views:number;sessions:number;cta_actions:number}>;
  leads:Array<any>;
  sources:Record<string,number>;
};

function AdminPage(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [session,setSession]=useState<any>(null);
  const [data,setData]=useState<Data|null>(null);
  const [error,setError]=useState("");

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setSession(data.session));
    const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>sub.subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!session) return;
    fetch(`${SUPABASE_URL}/functions/v1/pisipouk-admin-data`,{
      headers:{apikey:PUBLISHABLE_KEY,Authorization:`Bearer ${session.access_token}`}
    }).then(async r=>{
      if(!r.ok) throw new Error(r.status===403?"Ο λογαριασμός δεν έχει δικαιώματα admin.":"Δεν φορτώθηκαν τα δεδομένα.");
      return r.json();
    }).then(setData).catch(e=>setError(e.message));
  },[session]);

  const login=async(e:React.FormEvent)=>{
    e.preventDefault(); setError("");
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)setError("Λάθος στοιχεία σύνδεσης ή μη ενεργός λογαριασμός.");
  };

  if(!session) return <SiteLayout><section className="py-20"><div className="mx-auto max-w-md px-4"><div className="rounded-[2rem] border bg-card p-7 shadow-sm"><h1 className="text-3xl font-black">Pisipouk Admin</h1><p className="mt-2 text-sm text-muted-foreground">Μόνο για εξουσιοδοτημένη διοίκηση.</p><form onSubmit={login} className="mt-6 space-y-4"><Input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><Button className="w-full rounded-full">Σύνδεση</Button>{error&&<p className="text-sm text-destructive">{error}</p>}</form></div></div></section></SiteLayout>;

  return <SiteLayout><section className="py-12"><div className="mx-auto max-w-7xl px-4 lg:px-8">
    <div className="flex items-center justify-between gap-4"><div><p className="section-kicker">Pisipouk Growth</p><h1 className="mt-2 text-4xl font-black">Admin Dashboard</h1></div><Button variant="outline" onClick={()=>supabase.auth.signOut()}><LogOut className="h-4 w-4"/>Έξοδος</Button></div>
    {error&&<div className="mt-6 rounded-2xl bg-destructive/10 p-4 text-destructive">{error}</div>}
    {!data&&!error&&<p className="mt-8">Φόρτωση...</p>}
    {data&&<>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Users,"Επισκέπτες / 30ημ",data.summary.sessions],
          [Eye,"Pageviews / 30ημ",data.summary.pageViews],
          [MousePointerClick,"CTA actions / 30ημ",data.summary.conversions],
          [UserPlus,"Leads",data.summary.leads],
        ].map(([Icon,label,value])=>{const I=Icon as typeof Users;return <div key={String(label)} className="rounded-3xl border bg-card p-5"><I className="h-6 w-6 text-primary"/><p className="mt-4 text-sm text-muted-foreground">{label as string}</p><p className="mt-1 text-4xl font-black">{Number(value)}</p></div>})}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border bg-card p-6"><h2 className="text-2xl font-black">Πηγές traffic</h2><div className="mt-5 space-y-3">{Object.entries(data.sources).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=><div key={k} className="flex justify-between border-b pb-2"><span>{k}</span><b>{v}</b></div>)}</div></div>
        <div className="rounded-[2rem] border bg-card p-6"><h2 className="text-2xl font-black">Τελευταίες ημέρες</h2><div className="mt-5 space-y-3">{data.daily.slice(0,10).map(d=><div key={d.day} className="grid grid-cols-4 gap-2 border-b pb-2 text-sm"><span>{d.day}</span><span>{d.sessions} sessions</span><span>{d.page_views} views</span><b>{d.cta_actions} CTA</b></div>)}</div></div>
      </div>
      <div className="mt-8 overflow-x-auto rounded-[2rem] border bg-card p-6"><h2 className="text-2xl font-black">Leads</h2><table className="mt-5 w-full min-w-[800px] text-left text-sm"><thead><tr className="border-b"><th className="p-2">Ημερομηνία</th><th>Γονέας</th><th>Τηλέφωνο</th><th>Email</th><th>Ηλικία</th><th>Status</th><th>Email status</th></tr></thead><tbody>{data.leads.map(l=><tr key={l.id} className="border-b"><td className="p-2">{new Date(l.created_at).toLocaleString("el-GR")}</td><td>{l.parent_name}</td><td>{l.phone}</td><td>{l.email||"—"}</td><td>{l.child_age||"—"}</td><td>{l.status}</td><td>{l.email_status}</td></tr>)}</tbody></table></div>
    </>}
  </div></section></SiteLayout>
}
