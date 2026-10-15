import { createFileRoute } from "@tanstack/react-router";
import { AgeWorldHome } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/")({component:AgeHome});
function AgeHome(){const {age}=Route.useParams();return <AgeWorldHome ageKey={age}/>;}
