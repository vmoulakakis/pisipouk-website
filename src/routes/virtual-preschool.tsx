import { createFileRoute } from "@tanstack/react-router";
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
  component: PreschoolWonder,
});
