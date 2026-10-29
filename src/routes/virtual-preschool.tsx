import { createFileRoute } from "@tanstack/react-router";
import { PreschoolV3 } from "@/components/preschool/v3/PreschoolV3";
export const Route = createFileRoute("/virtual-preschool")({
 head:()=>({meta:[
  {title:"Ο Πισιπούκ • Το Ζωντανό Χωριό — Παιχνίδια & Ζωγραφική για 2–6"},
  {name:"description",content:"Μπες στο διαδραστικό χωριό του Πισιπούκ: ατελιέ ζωγραφικής με πατρόν Α4, χρώματα, ήχοι, φύση, παιχνίδια και παραμύθια για παιδιά 2–6 ετών."}
 ]}),
 component:PreschoolV3
});
