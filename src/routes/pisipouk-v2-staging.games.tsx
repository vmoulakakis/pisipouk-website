import { createFileRoute } from "@tanstack/react-router";
import { StageGames } from "@/features/preschool-v2/staging";
export const Route = createFileRoute("/pisipouk-v2-staging/games")({component:StageGames});
