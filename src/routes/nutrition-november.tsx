import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { novemberMenu2026 } from "@/content/novemberMenu2026";

export const Route = createFileRoute("/nutrition-november")({
  head: () => ({ meta: [
    { title: "Διαιτολόγιο Νοεμβρίου 2026 | Ο Πισιπούκ" },
    { name: "description", content: "Πρωινό, κυρίως γεύμα και συνοδευτικά για 2–27 Νοεμβρίου 2026. Προβολή ανά εβδομάδα και εκτύπωση." }
  ] }),
  component: NovemberMenu
});

function NovemberMenu() {
  const [selected, setSelected] = useState(-1);
  const weeks = selected < 0 ? novemberMenu2026 : [novemberMenu2026[selected]];
  return <SiteLayout>
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="rounded-[2rem] bg-gradient-to-r from-yellow-100 via-amber-50 to-emerald-100 p-6 sm:p-10">
        <p className="text-lg font-black text-emerald-700">🐻 Ο Πισιπούκ · Διαιτολόγιο</p>
        <h1 className="mt-3 text-4xl font-black text-sky-900 sm:text-6xl">Το μενού μας · Νοέμβριος 2026</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-700">Από Δευτέρα 2/11 έως Παρασκευή 27/11 · Πρωινό, κυρίως γεύμα και συνοδευτικά, όπως δόθηκαν από τον παιδικό σταθμό.</p>
        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          <Link to="/nutrition" className="rounded-xl bg-white px-5 py-3 font-bold text-sky-900 shadow-sm">← Διατροφή</Link>
          <button onClick={() => window.print()} className="rounded-xl bg-sky-800 px-5 py-3 font-bold text-white">🖨️ Εκτύπωση / PDF</button>
        </div>
      </div>
      <div className="my-7 flex flex-wrap gap-2 print:hidden">
        <button onClick={() => setSelected(-1)} className={`rounded-full px-4 py-2 font-semibold ${selected === -1 ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"}`}>Όλος ο μήνας</button>
        {novemberMenu2026.map((week,index) => <button key={week.week} onClick={() => setSelected(index)} className={`rounded-full px-4 py-2 font-semibold ${selected === index ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"}`}>{week.week}</button>)}
      </div>
      <div className="space-y-8">
        {weeks.map((week) => <section key={week.week} className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm print:break-inside-avoid">
          <h2 className="bg-emerald-100 px-5 py-4 text-2xl font-black text-emerald-950">📅 {week.week} 2026</h2>
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5 print:grid-cols-5">
            {week.days.map((d,i) => <article key={d.day} className="rounded-2xl border border-slate-200 bg-amber-50/40 p-4 print:break-inside-avoid">
              <h3 className="mb-4 rounded-lg bg-yellow-200 px-3 py-2 text-center font-black text-slate-900">{d.day}</h3>
              <p className="text-sm font-black text-emerald-700">🌞 Πρωινό</p><p className="mb-4 mt-1 text-sm leading-6">{d.breakfast}</p>
              <p className="text-sm font-black text-orange-700">🍽️ Κυρίως γεύμα</p><p className="mb-4 mt-1 text-sm font-semibold leading-6">{d.lunch}</p>
              <p className="text-sm font-black text-sky-800">🥗 Συνοδευτικά</p><p className="mt-1 text-sm leading-6">{d.sides}</p>
            </article>)}
          </div>
        </section>)}
      </div>
      <p className="mt-8 text-sm text-slate-600">Το πρόγραμμα που μας δόθηκε περιλαμβάνει 2–27 Νοεμβρίου. Η 30/11 δεν συμπεριλαμβάνεται. Για αλλεργίες ή αλλαγές στο μενού επικοινωνήστε με τον σταθμό.</p>
    </main>
    <style>{`@media print { @page { size: A4 landscape; margin: 7mm; } body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } main { max-width: none!important; padding:0!important; } section { break-after: page; box-shadow:none!important; } section:last-child {break-after:auto} h1 {font-size:24pt!important} article {padding:7px!important} article p {font-size:9pt!important;line-height:1.25!important;} }`}</style>
  </SiteLayout>
}