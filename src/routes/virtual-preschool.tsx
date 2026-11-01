import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PreschoolV12Runtime } from "@/components/preschool/PreschoolV12Runtime";
import { PreschoolWonder } from "@/components/preschool/wonder/PreschoolWonder";
export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Πισιπούκ • Παίζω, Μαθαίνω, Δημιουργώ | Online Preschool 2–6" },
      {
        name: "description",
        content:
          "Το διαδραστικό χωριό μάθησης του Πισιπούκ για παιδιά 2–6 ετών: 6 παιχνίδια, πατρόν Α4, οπτικές κατασκευές, ζωγραφική, ελληνικά παραμύθια και 16 εκπαιδευτικοί κόσμοι.",
      },
    ],
  }),
  component: PreschoolEntry,
});

/** V12 staged under the same preschool route until the complete release matrix is green. */
function PreschoolEntry(){
  const [v12,setV12]=useState(false);
  useEffect(()=>{
    const sync=()=>setV12(new URLSearchParams(window.location.search).get("world")==="v12");
    sync();window.addEventListener("popstate",sync);
    return()=>window.removeEventListener("popstate",sync);
  },[]);
  return v12?<PreschoolV12Runtime/>:<PreschoolWonder/>;
}
