import { createFileRoute } from "@tanstack/react-router";
import { StageShell } from "@/features/preschool-v2/staging";
export const Route = createFileRoute("/pisipouk-v2-staging")({
  head: () => ({meta:[{title:"Pisipouk World 2.0 | Design Staging"},{name:"robots",content:"noindex,nofollow"}]}),
  component: StageShell,
});
