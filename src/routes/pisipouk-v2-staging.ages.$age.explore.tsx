import {createFileRoute} from "@tanstack/react-router";
import {SpatialExplorer} from "@/features/preschool-v2/context/SpatialExplorer";
import {ageIndex} from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/explore")({component:Explore});
function Explore(){const {age}=Route.useParams();return <SpatialExplorer age={ageIndex(age)} ageKey={age}/>;}
