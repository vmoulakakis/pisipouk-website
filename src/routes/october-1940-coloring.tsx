import { createFileRoute } from "@tanstack/react-router";
import { Oxi1940Coloring } from "@/components/preschool/Oxi1940Coloring";
export const Route = createFileRoute("/october-1940-coloring")({
  head: () => ({ meta: [
    { title: "Ζωγραφίζω την 28η Οκτωβρίου 1940 | Ο Πισιπούκ" },
    { name: "description", content: "Διαδραστική ζωγραφική με ποντίκι ή αφή και τέσσερα δωρεάν εκτυπώσιμα πατρόν PDF Α4 για την 28η Οκτωβρίου 1940." }
  ] }),
  component: Oxi1940Coloring,
});
