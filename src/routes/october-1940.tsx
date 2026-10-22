import { createFileRoute } from "@tanstack/react-router";
import { Oxi1940Hub } from "@/components/preschool/Oxi1940Experience";
export const Route = createFileRoute("/october-1940")({
  head: () => ({ meta: [
    { title: "28η Οκτωβρίου 1940 | Ο Πισιπούκ — Online Preschool" },
    { name:"description", content:"Διαδραστικές δραστηριότητες και εικονογραφημένα εκτυπώσιμα βιβλιαράκια για παιδιά 2,5–3,5 και 4–6 ετών, αφιερωμένα στην επέτειο του ΟΧΙ." }
  ] }),
  component: Oxi1940Hub,
});