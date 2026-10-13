import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({ meta: [
    { title: "Πισιπούκ | Ο Μαγικός Εκπαιδευτικός Κόσμος" },
    { name: "description", content: "Εκπαιδευτικό εργαστήρι για 2–6 ετών: ζωγραφική αφής, ιστορίες, κατασκευές, παιχνίδια, εποχές, εκτύπωση και θετική ενθάρρυνση." }
  ]}),
  component: VirtualPreschool,
});
function VirtualPreschool(){
  const [height,setHeight]=useState(2050);
  useEffect(()=>{
    const onMessage=(e:MessageEvent)=>{
      if(e.origin!==window.location.origin || e.data?.type!=="pisipouk-learning-height")return;
      if(typeof e.data.height==="number")setHeight(Math.max(900,Math.min(12000,e.data.height+12)));
    };
    window.addEventListener("message",onMessage);
    return ()=>window.removeEventListener("message",onMessage);
  },[]);
  return <SiteLayout><main className="bg-[#fff9f0]">
    <iframe title="Ο Μαγικός Εκπαιδευτικός Κόσμος του Πισιπούκ" src="/pisipouk-learning-world.html?v=20261013r2" className="block w-full border-0" style={{height}} loading="eager"/>
  </main></SiteLayout>
}