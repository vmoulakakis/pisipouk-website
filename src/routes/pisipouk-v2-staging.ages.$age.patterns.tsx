import { createFileRoute } from "@tanstack/react-router";
import { AgePatternsRoute } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/patterns")({component:Patterns});
function Patterns(){const {age}=Route.useParams();return <AgePatternsRoute ageKey={age}/>;}
