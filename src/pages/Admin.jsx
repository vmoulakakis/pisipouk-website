import { useEffect, useMemo, useState } from 'react'
import { LogOut, MessageSquare, Star, Settings, RefreshCw, Trash2, Save, LockKeyhole } from 'lucide-react'
import { pisipoukApi } from '../lib/pisipoukApi'

const statuses = [
  ['new','Νέο'],['contacted','Επικοινωνήσαμε'],['appointment','Ραντεβού'],
  ['enrolled','Εγγραφή'],['closed','Κλειστό'],['spam','Spam']
]

function Login({onLogin}){
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)
  const submit=async e=>{
    e.preventDefault(); setBusy(true); setError('')
    try{ const r=await pisipoukApi.login(password); localStorage.setItem('pisipouk_admin_token',r.token); onLogin(r.token) }
    catch(err){ setError(err.message) } finally{ setBusy(false) }
  }
  return <div className="min-h-screen bg-cream grid place-items-center p-5">
    <form onSubmit={submit} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
      <p className="mono-label">ΠΙΣΙΠΟΥΚ ADMIN</p>
      <h1 className="section-title mt-3 !text-[2.7rem]">Σύνδεση</h1>
      <p className="mt-3 text-sm leading-7 text-earth/60">Μηνύματα, reviews, ρυθμίσεις και follow‑up σε ένα σημείο.</p>
      <label className="mt-6 block text-sm font-bold">Κωδικός</label>
      <input autoFocus type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-earth/15 bg-cream px-4 py-3 outline-none focus:border-terra" />
      {error&&<p className="mt-3 text-sm text-red-700">{error}</p>}
      <button disabled={busy} className="button button-primary mt-5 w-full">{busy?'Έλεγχος…':'Σύνδεση'}</button>
    </form>
  </div>
}

export default function Admin(){
  const [token,setToken]=useState(()=>localStorage.getItem('pisipouk_admin_token')||'')
  const [tab,setTab]=useState('messages')
  const [stats,setStats]=useState({})
  const [messages,setMessages]=useState([])
  const [reviews,setReviews]=useState([])
  const [settings,setSettings]=useState([])
  const [busy,setBusy]=useState(false)
  const [filter,setFilter]=useState('all')
  const [notice,setNotice]=useState('')
  const [reviewDraft,setReviewDraft]=useState({source:'google',rating:5,reviewer_name:'',review_text:'',source_url:'',verified:true,is_featured:false,is_published:true})
  const [newPassword,setNewPassword]=useState('')

  const load=async(t=token)=>{
    if(!t)return
    setBusy(true); setNotice('')
    try{
      const [st,ms,rv,se]=await Promise.all([pisipoukApi.stats(t),pisipoukApi.messages(t,filter),pisipoukApi.reviews(t),pisipoukApi.settings(t)])
      setStats(st.stats||{}); setMessages(ms.messages||[]); setReviews(rv.reviews||[]); setSettings(se.settings||[])
    }catch(e){
      if(String(e.message).includes('unauthorized')){ localStorage.removeItem('pisipouk_admin_token'); setToken('') }
      else setNotice(e.message)
    }finally{setBusy(false)}
  }

  useEffect(()=>{ if(token) load(token) },[token,filter])
  const unread=useMemo(()=>messages.filter(m=>m.status==='new'&&!m.archived).length,[messages])

  if(!token)return <Login onLogin={setToken}/>

  const saveMessage=async m=>{await pisipoukApi.updateMessage(token,m);setNotice('Το μήνυμα ενημερώθηκε.');load()}
  const removeMessage=async id=>{if(confirm('Οριστική διαγραφή μηνύματος;')){await pisipoukApi.deleteMessage(token,id);load()}}
  const saveReview=async e=>{e.preventDefault();await pisipoukApi.saveReview(token,reviewDraft);setReviewDraft({source:'google',rating:5,reviewer_name:'',review_text:'',source_url:'',verified:true,is_featured:false,is_published:true});load();setNotice('Η κριτική αποθηκεύτηκε.')}
  const saveSetting=async s=>{try{await pisipoukApi.saveSetting(token,s.key,JSON.parse(s.editor),s.is_public);setNotice('Η ρύθμιση αποθηκεύτηκε.');load()}catch(e){setNotice('Μη έγκυρο JSON ή σφάλμα αποθήκευσης.')}}
  const logout=async()=>{try{await pisipoukApi.logout(token)}catch{} localStorage.removeItem('pisipouk_admin_token');setToken('')}

  return <div className="min-h-screen bg-[#F5F1EA] text-earth">
    <header className="sticky top-0 z-20 border-b border-earth/10 bg-[#F5F1EA]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4">
        <div><p className="mono-label">ΠΙΣΙΠΟΥΚ</p><h1 className="text-xl font-extrabold">Admin Dashboard</h1></div>
        <div className="flex gap-2"><button onClick={()=>load()} className="button bg-white"><RefreshCw size={17}/></button><button onClick={logout} className="button bg-earth text-white"><LogOut size={17}/>Έξοδος</button></div>
      </div>
    </header>

    <main className="mx-auto max-w-[1500px] px-5 py-7">
      <div className="grid gap-4 md:grid-cols-5">
        {[['Σύνολο',stats.total||0],['Νέα',stats.new||0],['7 ημέρες',stats.last7days||0],['Ραντεβού',stats.appointments||0],['Εγγραφές',stats.enrolled||0]].map(([l,v])=><div key={l} className="rounded-3xl bg-white p-5 shadow-sm"><p className="text-sm text-earth/55">{l}</p><strong className="mt-2 block text-4xl">{v}</strong></div>)}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[['messages',MessageSquare,`Μηνύματα ${unread?'('+unread+')':''}`],['reviews',Star,'Reviews'],['settings',Settings,'Settings']].map(([id,Icon,label])=><button key={id} onClick={()=>setTab(id)} className={`button ${tab===id?'bg-earth text-white':'bg-white'}`}><Icon size={17}/>{label}</button>)}
      </div>
      {notice&&<div className="mt-4 rounded-2xl bg-sun/30 px-4 py-3 text-sm font-semibold">{notice}</div>}

      {tab==='messages'&&<section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold">Εισερχόμενα μηνύματα</h2>
          <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-xl border border-earth/10 bg-white px-4 py-3 font-bold">
            <option value="all">Όλα</option>{statuses.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="grid gap-4">
          {messages.map(m=><article key={m.id} className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h3 className="text-lg font-extrabold">{m.name}</h3><p className="mt-1 text-sm text-earth/60">{m.phone}{m.email?' · '+m.email:''}{m.child_age?' · Ηλικία: '+m.child_age:''}</p><p className="mt-1 text-xs text-earth/45">{new Date(m.created_at).toLocaleString('el-GR')}</p></div>
              <select value={m.status} onChange={e=>setMessages(x=>x.map(v=>v.id===m.id?{...v,status:e.target.value}:v))} className="rounded-xl bg-cream px-3 py-2 font-bold">{statuses.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>
            </div>
            {m.message&&<p className="mt-4 rounded-2xl bg-cream p-4 leading-7">{m.message}</p>}
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_240px]">
              <textarea value={m.admin_notes||''} onChange={e=>setMessages(x=>x.map(v=>v.id===m.id?{...v,admin_notes:e.target.value}:v))} rows="2" placeholder="Εσωτερικές σημειώσεις…" className="rounded-2xl border border-earth/10 px-4 py-3"/>
              <input type="datetime-local" value={m.follow_up_at?m.follow_up_at.slice(0,16):''} onChange={e=>setMessages(x=>x.map(v=>v.id===m.id?{...v,follow_up_at:e.target.value}:v))} className="rounded-2xl border border-earth/10 px-4 py-3"/>
            </div>
            <div className="mt-4 flex gap-2"><button onClick={()=>saveMessage(m)} className="button bg-earth text-white"><Save size={16}/>Αποθήκευση</button><button onClick={()=>removeMessage(m.id)} className="button bg-red-50 text-red-700"><Trash2 size={16}/>Διαγραφή</button></div>
          </article>)}
          {!messages.length&&!busy&&<div className="rounded-3xl bg-white p-8 text-center text-earth/55">Δεν υπάρχουν μηνύματα.</div>}
        </div>
      </section>}

      {tab==='reviews'&&<section className="mt-6 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={saveReview} className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-extrabold">Νέα επαληθευμένη κριτική</h2>
          <p className="mt-2 text-sm leading-6 text-earth/55">Προσθέτουμε μόνο πραγματικό κείμενο από δημόσια πηγή. Δεν δημιουργούμε testimonials.</p>
          <div className="mt-5 grid gap-3">
            <input required placeholder="Όνομα reviewer" value={reviewDraft.reviewer_name} onChange={e=>setReviewDraft({...reviewDraft,reviewer_name:e.target.value})} className="rounded-xl border border-earth/10 px-4 py-3"/>
            <select value={reviewDraft.rating} onChange={e=>setReviewDraft({...reviewDraft,rating:Number(e.target.value)})} className="rounded-xl border border-earth/10 px-4 py-3">{[5,4,3,2,1].map(x=><option key={x} value={x}>{x} αστέρια</option>)}</select>
            <textarea required rows="5" placeholder="Ακριβές κείμενο κριτικής" value={reviewDraft.review_text} onChange={e=>setReviewDraft({...reviewDraft,review_text:e.target.value})} className="rounded-xl border border-earth/10 px-4 py-3"/>
            <input placeholder="URL πηγής (Google κ.λπ.)" value={reviewDraft.source_url} onChange={e=>setReviewDraft({...reviewDraft,source_url:e.target.value})} className="rounded-xl border border-earth/10 px-4 py-3"/>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={reviewDraft.is_featured} onChange={e=>setReviewDraft({...reviewDraft,is_featured:e.target.checked})}/>Featured</label>
            <label className="flex gap-2 text-sm"><input type="checkbox" checked={reviewDraft.is_published} onChange={e=>setReviewDraft({...reviewDraft,is_published:e.target.checked})}/>Δημοσίευση στο site</label>
            <button className="button button-primary"><Save size={16}/>Αποθήκευση</button>
          </div>
        </form>
        <div className="grid gap-3">
          {reviews.map(r=><article key={r.id} className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex justify-between gap-4"><div><strong>{r.rating}/5 · {r.reviewer_name||'Γονέας'}</strong><p className="mt-2 leading-7">{r.review_text}</p><p className="mt-2 text-xs text-earth/50">{r.source} · {r.verified?'verified':'not verified'} · {r.is_published?'published':'draft'}</p></div><button onClick={async()=>{await pisipoukApi.deleteReview(token,r.id);load()}} className="self-start rounded-full bg-red-50 p-3 text-red-700"><Trash2 size={16}/></button></div></article>)}
          {!reviews.length&&<div className="rounded-3xl bg-white p-8 text-earth/55">Δεν έχουν εισαχθεί ακόμη verified review texts.</div>}
        </div>
      </section>}

      {tab==='settings'&&<section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Site configuration</h2>
          <div className="mt-4 grid gap-4">{settings.map((s,i)=>{
            if(s.editor===undefined) s.editor=JSON.stringify(s.value,null,2)
            return <article key={s.key} className="rounded-3xl bg-white p-5"><div className="flex items-center justify-between gap-3"><strong>{s.key}</strong><span className="text-xs text-earth/45">{s.is_public?'public':'private'}</span></div><textarea rows="8" value={s.editor} onChange={e=>setSettings(x=>x.map((v,j)=>j===i?{...v,editor:e.target.value}:v))} className="mt-3 w-full rounded-2xl border border-earth/10 bg-cream p-4 font-mono text-xs"/><button onClick={()=>saveSetting(s)} className="button bg-earth text-white mt-3"><Save size={16}/>Αποθήκευση</button></article>
          })}</div>
        </div>
        <aside className="rounded-3xl bg-white p-6 shadow-sm self-start">
          <div className="flex items-center gap-2"><LockKeyhole/><h2 className="text-xl font-extrabold">Αλλαγή κωδικού</h2></div>
          <p className="mt-2 text-sm leading-6 text-earth/55">Μετά την αλλαγή θα χρειαστεί νέα σύνδεση.</p>
          <input type="password" placeholder="Νέος κωδικός ≥14 χαρακτήρες" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="mt-4 w-full rounded-xl border border-earth/10 px-4 py-3"/>
          <button onClick={async()=>{await pisipoukApi.changePassword(token,newPassword);localStorage.removeItem('pisipouk_admin_token');setToken('')}} className="button button-primary mt-3 w-full">Αλλαγή κωδικού</button>
        </aside>
      </section>}
    </main>
  </div>
}
