import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Brand from './Brand'

const links = [['/','Αρχική'],['/paroxes','Παροχές & Ασφάλεια'],['/gallery','Χώροι & Δραστηριότητες'],['/epikoinonia','Επικοινωνία']]

export default function Navbar() {
  const [open,setOpen] = useState(false)
  return <header className="sticky top-0 z-50 border-b border-earth/10 bg-cream/90 backdrop-blur-xl"><nav className="site-shell flex min-h-20 items-center justify-between gap-4" aria-label="Κύρια πλοήγηση"><NavLink to="/" onClick={()=>setOpen(false)} aria-label="Πισιπούκ — αρχική"><Brand/></NavLink><div className="hidden items-center gap-7 lg:flex">{links.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>`nav-link ${isActive?'is-active':''}`}>{label}</NavLink>)}<NavLink to="/epikoinonia" className="button button-primary">Κλείσε Ραντεβού</NavLink></div><button className="grid h-12 w-12 place-items-center rounded-full border border-earth/15 lg:hidden" onClick={()=>setOpen(v=>!v)} aria-label={open?'Κλείσιμο μενού':'Άνοιγμα μενού'} aria-expanded={open}>{open?<X/>:<Menu/>}</button></nav>{open&&<div className="border-t border-earth/10 bg-cream px-[8vw] py-5 lg:hidden"><div className="grid gap-2">{links.map(([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className="rounded-2xl px-4 py-3 font-semibold hover:bg-sun/30">{label}</NavLink>)}</div></div>}</header>
}
