import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
export const Route=createFileRoute("/virtual-preschool")({
 head:()=>({meta:[{title:"Πισιπούκ | Ο Μαγικός Κόσμος Μάθησης"},{name:"description",content:"Διαδραστικό preschool 2–6: ηλικιακές δραστηριότητες, ζωγραφική, παραμύθια, εκπαιδευτικές αποστολές, εκτύπωση."}]}),
 component:VirtualPreschool,
});
function VirtualPreschool(){
 useEffect(()=>{window.location.replace("/pisipouk-learning-world.html?release=20261014-prd");},[]);
 return <main style={{minHeight:"80vh",display:"grid",placeItems:"center",background:"#fff8e9",padding:30,textAlign:"center",fontFamily:"system-ui"}}>
 <div><h1>🐻 Ο Μαγικός Κόσμος του Πισιπούκ</h1><p>Άνοιξε τη νέα εκπαιδευτική εμπειρία με τις δραστηριότητες ανά ηλικία.</p><a href="/pisipouk-learning-world.html?release=20261014-prd" style={{display:"inline-block",padding:"15px 26px",borderRadius:20,background:"#ffc547",fontWeight:900,color:"#49331e"}}>Μπες στον κόσμο του Πισιπούκ →</a></div></main>;
}