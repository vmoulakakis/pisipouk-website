import { createFileRoute } from "@tanstack/react-router";
import { Oxi1940Game } from "@/components/preschool/Oxi1940Experience";
export const Route = createFileRoute("/october-1940-young")({
  head: () => ({ meta: [{ title: "28η Οκτωβρίου — 2,5–3,5 ετών | Ο Πισιπούκ" }] }),
  component: () => <Oxi1940Game age="little" />,
});