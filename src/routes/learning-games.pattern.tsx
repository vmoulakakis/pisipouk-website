import { createFileRoute } from "@tanstack/react-router";
import { LearningGamePage, type Age } from "@/components/learning/LearningGamePage";

function parseAge(value: unknown): Age {
  return value === "4-5" || value === "5-6" ? value : "2-3";
}

export const Route = createFileRoute("/learning-games/pattern")({
  validateSearch: (search: Record<string, unknown>) => ({ age: parseAge(search.age) }),
  head: () => ({
    meta: [
      { title: "Βρες το Μοτίβο | Ο Πισιπούκ" },
      { name: "description", content: "Βρες το Μοτίβο για παιδιά 2–6 ετών, με τυχαίους γύρους και προσαρμογή δυσκολίας ανά ηλικία." },
    ],
  }),
  component: GameRoute,
});

function GameRoute() {
  const { age } = Route.useSearch();
  return <LearningGamePage gameId="pattern" age={age} />;
}
