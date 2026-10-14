import { createFileRoute } from "@tanstack/react-router";
import { PreschoolWorld } from "@/components/preschool/world/World";
export const Route = createFileRoute("/virtual-preschool")({
  head: () => ({
    meta: [
      { title: "Πισιπούκ · Το χωριό της μάθησης" },
      {
        name: "description",
        content:
          "Ένα εικονογραφημένο χωριό μάθησης για παιδιά 2–6 ετών: 16 κόσμοι, παιχνίδια, ζωγραφική, ελληνικές ιστορίες και PDF με την παρουσία ενηλίκου.",
      },
    ],
  }),
  component: PreschoolWorld,
});
