import { createFileRoute } from "@tanstack/react-router";
import { StageStories } from "@/features/preschool-v2/staging";
export const Route = createFileRoute("/pisipouk-v2-staging/stories")({component:StageStories});
