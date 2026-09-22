import { createFileRoute } from "@tanstack/react-router";
import { LearningGamePage, type Age } from "@/components/learning/LearningGamePage";

function parseAge(value: unknown): Age {
  return value === "4-5" || value === "5-6" ? value : "2-3";
}

export const Route = createFileRoute("/learning-games/size-order")({
  validateSearch: (search: Record<string, unknown>) => ({ age: parseAge(search.age) }),
  head: () => ({
    meta: [
      { title: "Από μικρό σε μεγάλο | Ο Πισιπούκ" },
      { name: "description", content: "Από μικρό σε μεγάλο για παιδιά 2–6 ετών, με τυχαία δομή και προσαρμογή δυσκολίας ανά ηλικία." },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  const { age } = Route.useSearch();
  return <LearningGamePage gameId="size-order" age={age} />;
}
