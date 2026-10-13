import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PreschoolGameLab } from "@/components/preschool/PreschoolGameLab";
import type { PreschoolAge } from "@/content/virtualPreschoolMedia";

export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Ο Μαγικός Κόσμος του Πισιπούκ | Διαδραστικό Νηπιαγωγείο" },
      { name: "description", content: "Ηλικιακές δραστηριότητες 2–6 ετών, ζωγραφική, κατασκευές, ιστορίες, εκπαιδευτικά παιχνίδια, αστεράκια και εκτύπωση PDF." },
    ],
  }),
  component: VirtualPreschool,
});

function VirtualPreschool() {
  const [age,setAge] = useState<PreschoolAge>("4–5");
  return <SiteLayout>
    <main className="bg-[#fff9f0]">
      <iframe
        title="Ο Μαγικός Κόσμος του Πισιπούκ — ζωγραφική, παραμύθια και εκπαιδευτικές δραστηριότητες"
        src="/pisipouk-learning-world.html"
        className="block w-full border-0"
        style={{height:"3200px"}}
        loading="eager"
      />
      <section id="more-games" className="mx-auto max-w-7xl px-4 pb-16 pt-10">
        <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm">
          <p className="font-black uppercase tracking-wider text-amber-700">Περισσότερη εξερεύνηση</p>
          <h2 className="text-3xl font-black text-[#49331e]">🎮 Διαδραστικά εκπαιδευτικά παιχνίδια</h2>
          <p className="mt-2 text-[#735e49]">Παιχνίδια αριθμών, σχημάτων, μνήμης, γλώσσας και συναισθημάτων, ανά ηλικία.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {([["2–3","2–3 ετών"],["4–5","3–5 ετών"],["5–6","5–6 ετών"]] as const).map(([value,label]) =>
              <button key={value} onClick={()=>setAge(value)} className={`rounded-full px-5 py-3 font-black ${age===value?"bg-amber-400 text-amber-950":"bg-amber-50 text-amber-900"}`}>{label}</button>
            )}
          </div>
        </div>
        <PreschoolGameLab age={age} />
      </section>
    </main>
  </SiteLayout>;
}
