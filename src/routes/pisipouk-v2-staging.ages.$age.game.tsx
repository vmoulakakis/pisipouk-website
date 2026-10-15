import { createFileRoute } from "@tanstack/react-router";
import { AgeGameRoute } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/game")({component:Game});
function Game(){const {age}=Route.useParams();return <AgeGameRoute ageKey={age}/>;}
