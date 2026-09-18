import { useEffect, useState } from 'react'
import { Star, ExternalLink } from 'lucide-react'
import { pisipoukApi } from '../lib/pisipoukApi'

export default function ReviewSummary(){
  const [rating,setRating]=useState({rating:3.8,count:5})
  const [reviews,setReviews]=useState([])
  useEffect(()=>{
    Promise.all([pisipoukApi.publicSettings(),pisipoukApi.publicReviews()])
      .then(([s,r])=>{
        if(s?.settings?.google_reviews) setRating(s.settings.google_reviews)
        setReviews(r?.reviews || [])
      }).catch(()=>{})
  },[])
  return <section className="site-shell section-space">
    <div className="rounded-[2.3rem] border border-earth/10 bg-white p-7 shadow-[0_28px_80px_rgba(42,42,42,.07)] md:p-10">
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-center">
        <div>
          <p className="mono-label">ΑΞΙΟΛΟΓΗΣΕΙΣ GOOGLE</p>
          <div className="mt-3 flex items-end gap-3">
            <strong className="font-serif text-6xl leading-none">{rating.rating}</strong>
            <div className="pb-1"><div className="flex gap-1 text-[#E9A600]">{[1,2,3,4,5].map(n=><Star key={n} size={19} fill={n <= Math.round(rating.rating) ? 'currentColor' : 'none'}/>)}</div><p className="mt-1 text-sm text-earth/60">{rating.count} δημόσιες αξιολογήσεις</p></div>
          </div>
          <a className="text-link mt-5" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=%CE%A0%CE%B9%CF%83%CE%B9%CF%80%CE%BF%CF%8D%CE%BA+%CE%94%CE%B7%CE%BC.+%CE%A8%CF%85%CF%87%CE%BF%CE%B3%CE%B9%CE%BF%CF%8D+20+%CE%86%CE%B3%CE%B9%CE%BF%CF%82+%CE%94%CE%B7%CE%BC%CE%AE%CF%84%CF%81%CE%B9%CE%BF%CF%82">Δείτε τις αξιολογήσεις <ExternalLink size={15}/></a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.length ? reviews.slice(0,4).map(r=><article key={r.id} className="rounded-3xl bg-cream p-5">
            <div className="flex gap-1 text-[#E9A600]">{[1,2,3,4,5].map(n=><Star key={n} size={15} fill={n <= r.rating ? 'currentColor' : 'none'}/>)}</div>
            <p className="mt-3 leading-7 text-earth/75">“{r.review_text}”</p>
            <p className="mt-3 text-sm font-bold">{r.reviewer_name || 'Γονέας'} {r.verified ? '· επαληθευμένη' : ''}</p>
          </article>) : <div className="md:col-span-2 rounded-3xl bg-cream p-6 text-earth/65">
            Εδώ θα εμφανίζονται μόνο επαληθευμένες δημόσιες κριτικές που έχουν εγκριθεί από το admin dashboard. Δεν δημιουργούμε τεχνητά testimonials.
          </div>}
        </div>
      </div>
    </div>
  </section>
}
