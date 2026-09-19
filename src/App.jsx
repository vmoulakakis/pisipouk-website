import { useEffect, useState } from 'react'
import { ArrowRight, Baby, Bus, Check, Clock3, Heart, MapPin, Menu, Phone, ShieldCheck, Sparkles, Utensils, X } from 'lucide-react'

const benefits = [
  { icon: ShieldCheck, title: 'Ασφάλεια & φροντίδα', text: 'Σταθερή καθημερινότητα, προσεγμένοι χώροι και ουσιαστική επικοινωνία με την οικογένεια.' },
  { icon: Sparkles, title: 'Μάθηση μέσα από το παιχνίδι', text: 'Δημιουργία, κίνηση, παραμύθι, συνεργασία και μικρές ανακαλύψεις κάθε μέρα.' },
  { icon: Utensils, title: 'Πλήρης διατροφή', text: 'Οργανωμένο καθημερινό πρόγραμμα διατροφής για τις ανάγκες της προσχολικής ηλικίας.' },
  { icon: Bus, title: 'Σχολική μεταφορά', text: 'Δυνατότητα οργανωμένης μεταφοράς για την καλύτερη εξυπηρέτηση της οικογένειας.' },
]

const daily = [
  ['07:00', 'Καλημέρα & υποδοχή', 'Ήρεμη έναρξη, παιχνίδι και προσαρμογή στον ρυθμό της ημέρας.'],
  ['09:00', 'Δημιουργική μάθηση', 'Ζωγραφική, μουσική, παραμύθι, γλώσσα και βιωματικές δραστηριότητες.'],
  ['11:30', 'Κίνηση & παιχνίδι', 'Ελεύθερη έκφραση, αυλή και δραστηριότητες που καλλιεργούν συνεργασία.'],
  ['13:00', 'Φαγητό & ξεκούραση', 'Σταθερή ρουτίνα, φροντίδα και χρόνος χαλάρωσης.'],
]

function SectionTitle({eyebrow,title,copy,center=false}) {
  return <div className={center ? 'section-heading center' : 'section-heading'}>
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
}

export default function App(){
  const [menuOpen,setMenuOpen]=useState(false)
  const [formState,setFormState]=useState({status:'idle',message:''})
  const [scrolled,setScrolled]=useState(false)

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>18)
    onScroll()
    window.addEventListener('scroll',onScroll,{passive:true})
    return ()=>window.removeEventListener('scroll',onScroll)
  },[])

  const submit=async(e)=>{
    e.preventDefault()
    const form=e.currentTarget
    const data=Object.fromEntries(new FormData(form).entries())
    data.consent=Boolean(data.consent)
    setFormState({status:'loading',message:''})
    try{
      const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      const result=await response.json().catch(()=>({}))
      if(!response.ok) throw new Error(result.error || 'Η αποστολή δεν ολοκληρώθηκε.')
      setFormState({status:'success',message:'Το αίτημά σας στάλθηκε. Θα επικοινωνήσουμε μαζί σας σύντομα.'})
      form.reset()
    }catch(error){
      setFormState({status:'error',message:error.message || 'Δοκιμάστε ξανά ή καλέστε μας στο 210 975 6277.'})
    }
  }

  const closeMenu=()=>setMenuOpen(false)

  return <div className="site">
    <header className={scrolled ? 'topbar scrolled' : 'topbar'}>
      <div className="shell nav">
        <a href="#top" className="brand" onClick={closeMenu} aria-label="Πισιπούκ αρχική">
          <span className="brand-mark">☀</span>
          <span><strong>Πισιπούκ</strong><small>Παιδικός Σταθμός · Νηπιαγωγείο</small></span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Κύρια πλοήγηση">
          <a href="#about" onClick={closeMenu}>Η φιλοσοφία μας</a>
          <a href="#day" onClick={closeMenu}>Η μέρα μας</a>
          <a href="#benefits" onClick={closeMenu}>Παροχές</a>
          <a href="#contact" onClick={closeMenu}>Επικοινωνία</a>
          <a className="mobile-call" href="tel:+302109756277" onClick={closeMenu}>Κάλεσέ μας</a>
        </nav>

        <a className="nav-cta" href="#contact">Κλείσε επίσκεψη <ArrowRight size={17}/></a>
        <button className="menu-btn" onClick={()=>setMenuOpen(v=>!v)} aria-label="Μενού">
          {menuOpen ? <X/> : <Menu/>}
        </button>
      </div>
    </header>

    <main id="top">
      <section className="hero shell">
        <div className="hero-card">
          <img src="/preview/hero.webp" alt="Πισιπούκ — παιδικός σταθμός και νηπιαγωγείο" className="hero-image"/>
          <div className="hero-overlay"/>
          <div className="hero-copy">
            <div className="hero-badge"><span>ΑΓΙΟΣ ΔΗΜΗΤΡΙΟΣ</span><i/> <span>ΑΠΟ ΤΟ 1991</span></div>
            <h1>Ένα δεύτερο σπίτι για τα <em>πρώτα μεγάλα βήματα.</em></h1>
            <p>Παιδικός σταθμός και νηπιαγωγείο με φροντίδα, δημιουργία και καθημερινές μικρές ανακαλύψεις — σε ένα περιβάλλον που θέλει το παιδί να νιώθει ασφαλές και χαρούμενο.</p>
            <div className="hero-actions">
              <a href="#contact" className="button primary">Κλείσε επίσκεψη <ArrowRight size={18}/></a>
              <a href="tel:+302109756277" className="button glass"><Phone size={17}/> 210 975 6277</a>
            </div>
          </div>
          <div className="hero-note">
            <span>🧸</span>
            <div><strong>Πισιπούκ</strong><small>Μεγαλώνουμε μαζί.</small></div>
          </div>
        </div>

        <div className="trust-strip">
          <div><Baby/><span><strong>2–6 ετών</strong><small>Παιδικός σταθμός & νηπιαγωγείο</small></span></div>
          <div><Clock3/><span><strong>07:00–17:00</strong><small>Καθημερινό ωράριο</small></span></div>
          <div><Utensils/><span><strong>Πλήρης διατροφή</strong><small>Οργανωμένο πρόγραμμα</small></span></div>
          <div><Check/><span><strong>Voucher ΕΣΠΑ</strong><small>Ενημέρωση για εγγραφές</small></span></div>
        </div>
      </section>

      <section id="about" className="section shell story-grid">
        <div>
          <SectionTitle eyebrow="Η ΦΙΛΟΣΟΦΙΑ ΜΑΣ" title="Το παιδί δεν χρειάζεται απλώς έναν χώρο. Χρειάζεται να νιώθει ότι ανήκει." copy="Στο Πισιπούκ η καθημερινότητα οργανώνεται γύρω από τη φροντίδα, την ασφάλεια, τη δημιουργία και τη σχέση εμπιστοσύνης με τους γονείς."/>
          <div className="check-list">
            <span><Check/> Σταθερό και ζεστό παιδαγωγικό περιβάλλον</span>
            <span><Check/> Μάθηση μέσα από παιχνίδι και εμπειρίες</span>
            <span><Check/> Καθημερινή επικοινωνία με την οικογένεια</span>
          </div>
          <a className="text-link" href="#contact">Γνωρίστε μας από κοντά <ArrowRight size={17}/></a>
        </div>

        <div className="story-visual">
          <div className="blob blob-one"/>
          <div className="blob blob-two"/>
          <div className="story-card main-card">
            <span className="big-emoji">🧸</span>
            <strong>Μικρές στιγμές.<br/>Μεγάλες αναμνήσεις.</strong>
            <p>Η παιδική ηλικία θέλει χώρο για παιχνίδι, φαντασία και εμπιστοσύνη.</p>
          </div>
          <div className="story-card mini-card"><Heart/> Φροντίδα κάθε μέρα</div>
        </div>
      </section>

      <section id="day" className="section day-section">
        <div className="shell">
          <SectionTitle eyebrow="Η ΚΑΘΗΜΕΡΙΝΟΤΗΤΑ" title="Μια μέρα με ρυθμό, παιχνίδι και χώρο για ανακάλυψη." copy="Ένα απλό, κατανοητό πρόγραμμα που βοηθά τα παιδιά να νιώθουν σιγουριά και τους γονείς να ξέρουν τι συμβαίνει μέσα στη μέρα." center/>
          <div className="timeline">
            {daily.map(([time,title,text],i)=><article className="time-card" key={time}>
              <div className="time-index">{String(i+1).padStart(2,'0')}</div>
              <time>{time}</time>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="benefits" className="section shell">
        <SectionTitle eyebrow="Ο,ΤΙ ΘΕΛΕΙ ΝΑ ΞΕΡΕΙ ΕΝΑΣ ΓΟΝΕΑΣ" title="Συγκεκριμένες παροχές. Καθαρή ενημέρωση." copy="Χωρίς υπερβολές και γενικότητες — τα βασικά που έχουν σημασία στην καθημερινότητα μιας οικογένειας."/>
        <div className="benefit-grid">
          {benefits.map(({icon:Icon,title,text})=><article className="benefit-card" key={title}>
            <div className="icon-box"><Icon/></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>)}
        </div>

        <div className="visit-banner">
          <div>
            <span className="eyebrow light">ΕΓΓΡΑΦΕΣ 2026–2027</span>
            <h3>Πριν αποφασίσετε, ελάτε να γνωρίσετε τον χώρο.</h3>
            <p>Η καλύτερη εικόνα είναι η πραγματική επίσκεψη. Δείτε το περιβάλλον, γνωρίστε μας και ρωτήστε ό,τι σας ενδιαφέρει.</p>
          </div>
          <a href="#contact" className="button yellow">Κλείσε επίσκεψη <ArrowRight size={18}/></a>
        </div>
      </section>

      <section className="section values-section">
        <div className="shell values-grid">
          <div className="values-copy">
            <SectionTitle eyebrow="ΓΙΑΤΙ ΠΙΣΙΠΟΥΚ" title="Γιατί οι γονείς χρειάζονται σιγουριά — όχι απλώς ωραίες λέξεις."/>
          </div>
          <div className="value-stack">
            <div><span>01</span><p><strong>Πραγματική καθημερινότητα</strong> με σταθερές ρουτίνες και σαφή επικοινωνία.</p></div>
            <div><span>02</span><p><strong>Παιδαγωγική προσέγγιση</strong> που δίνει χώρο σε κάθε παιδί να εξελιχθεί με τον δικό του ρυθμό.</p></div>
            <div><span>03</span><p><strong>Συνεργασία με την οικογένεια</strong> γιατί η εμπιστοσύνη χτίζεται με συνέπεια.</p></div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="shell contact-grid">
          <div className="contact-copy">
            <span className="eyebrow light">ΕΠΙΚΟΙΝΩΝΙΑ</span>
            <h2>Ελάτε να δείτε τον χώρο με τα δικά σας μάτια.</h2>
            <p>Στείλτε αίτημα επίσκεψης ή καλέστε μας. Θα χαρούμε να γνωριστούμε και να συζητήσουμε τι χρειάζεται η οικογένειά σας.</p>
            <div className="contact-details">
              <a href="tel:+302109756277"><Phone/><span><small>Τηλέφωνο</small><strong>210 975 6277</strong></span></a>
              <div><MapPin/><span><small>Διεύθυνση</small><strong>Δημ. Ψυχογιού 20, Άγιος Δημήτριος</strong></span></div>
              <div><Clock3/><span><small>Ωράριο</small><strong>07:00–17:00</strong></span></div>
            </div>
          </div>

          <form className="contact-form" onSubmit={submit}>
            <div className="form-head"><span>🧸</span><div><strong>Κλείστε μια επίσκεψη</strong><small>Συμπληρώστε τα στοιχεία σας.</small></div></div>
            <label>Όνομα γονέα<input name="name" required maxLength="100" placeholder="Το όνομά σας"/></label>
            <label>Τηλέφωνο<input name="phone" required maxLength="40" inputMode="tel" placeholder="69..."/></label>
            <label>Email <span>(προαιρετικό)</span><input name="email" maxLength="160" type="email" placeholder="name@email.gr"/></label>
            <label>Τι θα θέλατε να συζητήσουμε;<textarea name="message" maxLength="1500" rows="4" placeholder="Ηλικία παιδιού, ενδιαφέρον για εγγραφή, απορίες..."/></label>
            <input className="trap" type="text" name="company" tabIndex="-1" autoComplete="off"/>
            <label className="consent"><input type="checkbox" name="consent" required/><span>Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για επικοινωνία σχετικά με το αίτημά μου.</span></label>
            <button className="button primary full" disabled={formState.status==='loading'}>{formState.status==='loading' ? 'Αποστολή…' : 'Στείλε αίτημα'} <ArrowRight size={18}/></button>
            {formState.message && <div className={'form-message '+formState.status}>{formState.message}</div>}
          </form>
        </div>
      </section>
    </main>

    <footer>
      <div className="shell footer-inner">
        <div className="brand footer-brand"><span className="brand-mark">☀</span><span><strong>Πισιπούκ</strong><small>Παιδικός Σταθμός · Νηπιαγωγείο</small></span></div>
        <p>© 2026 Πισιπούκ · Άγιος Δημήτριος</p>
        <a href="tel:+302109756277">210 975 6277</a>
      </div>
    </footer>

    <div className="mobile-bar">
      <a href="tel:+302109756277"><Phone size={18}/> Κλήση</a>
      <a href="#contact">Κλείσε επίσκεψη <ArrowRight size={17}/></a>
    </div>
  </div>
}
