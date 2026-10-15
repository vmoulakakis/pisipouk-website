import { createFileRoute } from "@tanstack/react-router";
import { AgeStoriesRoute } from "@/features/preschool-v2/age-worlds";
export const Route=createFileRoute("/pisipouk-v2-staging/ages/$age/stories")({component:Stories});
function Stories(){const {age}=Route.useParams();return <AgeStoriesRoute ageKey={age}/>;}
