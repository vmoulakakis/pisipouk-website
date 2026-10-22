import { createFileRoute } from "@tanstack/react-router";
import { Oxi1940Game } from "@/components/preschool/Oxi1940Experience";
export const Route = createFileRoute("/october-1940-older")({
  head: () => ({ meta: [{ title: "28η Οκτωβρίου — 4–6 ετών | Ο Πισιπούκ" }] }),
  component: () => <Oxi1940Game age="big" />,
});