import { createFileRoute } from "@tanstack/react-router";
import { AgeCraftsRoute } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/crafts")({component:Crafts});
function Crafts(){const {age}=Route.useParams();return <AgeCraftsRoute ageKey={age}/>;}
