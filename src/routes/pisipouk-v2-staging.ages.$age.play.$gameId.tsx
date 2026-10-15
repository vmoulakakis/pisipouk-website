import {createFileRoute} from "@tanstack/react-router";
import {EducationalGame} from "@/features/preschool-v2/games/EducationalGame";
import {ageIndex} from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/play/$gameId")({component:Play});
function Play(){const {age,gameId}=Route.useParams();const index=Number(gameId);return Number.isInteger(index)&&index>=1&&index<=19?<EducationalGame age={ageIndex(age)} ageKey={age} index={index}/>:<p>Το παιχνίδι δεν βρέθηκε.</p>}
