import { createFileRoute } from "@tanstack/react-router";
import { AgeShell } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age")({component:AgeLayout});
function AgeLayout(){const {age}=Route.useParams();return <AgeShell ageKey={age}/>;}
