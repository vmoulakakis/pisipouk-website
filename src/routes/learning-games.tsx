import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learning-games")({
  component: LearningGamesLayout,
});

function LearningGamesLayout() {
  return <Outlet />;
}
