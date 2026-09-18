import { useState } from 'react'
import { MapPin,Phone,Send } from 'lucide-react'
import Page,{ Reveal } from '../components/Page'
import { pisipoukApi } from '../lib/pisipoukApi'

export default function Contact(){
  const [state,setState]=useState({status:'idle',message:''})
  const submit=async e=>{
    e.preventDefault();setState({status:'sending',message:''})
    const form=new FormData(e.currentTarget)
    const payload=Object.fromEntries(form.entries())
    payload.consent=payload.consent==='yes'
    payload.source='pisipouk.vercel.app'
    const q=new URLSearchParams(location.search)
    payload.utm_source=q.get('utm_source')||''
    payload.utm_medium=q.get('utm_medium')||''
    payload.utm_campaign=q.get('utm_campaign')||''
    try{
      await pisipoukApi.contact(payload)
      e.currentTarget.reset()
      setState({status:'success',message:'Ευχαριστούμε! Το μήνυμά σας καταχωρήθηκε και θα επικοινωνήσουμε μαζί σας σύντομα.'})
    }catch(err){
      setState({status:'error',message:`${err.message} Μπορείτε επίσης να καλέσετε στο 210 975 6277.`})
    }
  }
  return <Page>
    <section className="site-shell section-space pt-12"><Reveal><p className="mono-label">ΕΠΙΚΟΙΝΩΝΙΑ</p><h1 className="display-title mt-4 max-w-5xl text-earth">Ελάτε να γνωριστούμε από κοντά.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-earth/65">Δεν χρειάζεται email server: το αίτημά σας καταχωρείται με ασφάλεια στο σύστημα του Πισιπούκ και εμφανίζεται άμεσα στο admin dashboard.</p></Reveal></section>
    <section className="site-shell grid gap-5 pb-24 lg:grid-cols-2">
      <Reveal className="overflow-hidden rounded-[2.2rem] bg-sky/25"><iframe title="Χάρτης Πισιπούκ" className="min-h-[560px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=%CE%94%CE%B7%CE%BC.%20%CE%A8%CF%85%CF%87%CE%BF%CE%B3%CE%B9%CE%BF%CF%8D%2020%2C%20%CE%86%CE%B3%CE%B9%CE%BF%CF%82%20%CE%94%CE%B7%CE%BC%CE%AE%CF%84%CF%81%CE%B9%CE%BF%CF%82&output=embed"/></Reveal>
      <Reveal className="contact-panel">
        <div className="mb-8 flex flex-wrap gap-5 text-sm"><a href="tel:+302109756277" className="flex items-center gap-2"><Phone size={17}/>210 975 6277</a><span className="flex items-center gap-2"><MapPin size={17}/>Δημ. Ψυχογιού 20</span></div>
        <form onSubmit={submit} className="conversation-form">
          <p>Γεια, ονομάζομαι <input required name="name" aria-label="Ονοματεπώνυμο γονέα" placeholder="το όνομά σας"/> και θα ήθελα να επισκεφθώ το Πισιπούκ.</p>
          <p>Μπορείτε να με καλέσετε στο <input required name="phone" inputMode="tel" aria-label="Τηλέφωνο" placeholder="τηλέφωνο"/> ή να μου γράψετε στο <input name="email" type="email" aria-label="Email" placeholder="email (προαιρετικό)"/>.</p>
          <p>Η ηλικία του παιδιού είναι <input name="child_age" aria-label="Ηλικία παιδιού" placeholder="π.χ. 3 ετών"/>.</p>
          <p>Θα ήθελα επίσης να σας πω: <textarea name="message" aria-label="Μήνυμα" placeholder="γράψτε εδώ το μήνυμά σας" rows="3"/></p>
          <label className="consent"><input required type="checkbox" name="consent" value="yes"/> Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου μόνο για την επικοινωνία σχετικά με το αίτημά μου.</label>
          <input className="hidden" tabIndex="-1" autoComplete="off" name="company" aria-hidden="true"/>
          <button disabled={state.status==='sending'} className="button button-primary mt-6" type="submit"><Send size={17}/>{state.status==='sending'?'Αποστολή…':'Στείλε το αίτημα'}</button>
          {state.message&&<p role="status" className={`form-status ${state.status}`}>{state.message}</p>}
        </form>
      </Reveal>
    </section>
  </Page>
}
