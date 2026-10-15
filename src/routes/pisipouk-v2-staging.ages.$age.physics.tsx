import { createFileRoute } from "@tanstack/react-router";
import { PhaserPhysicsGarden } from "@/features/preschool-v2/physics/PhaserGarden";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/physics")({component:Physics});
function Physics(){const {age}=Route.useParams();return <PhaserPhysicsGarden ageKey={age}/>;}
