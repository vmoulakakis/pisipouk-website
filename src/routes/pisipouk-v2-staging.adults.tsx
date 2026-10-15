import {createFileRoute,Outlet} from "@tanstack/react-router";
export const Route=createFileRoute("/pisipouk-v2-staging/adults")({component:AdultsLayout});
function AdultsLayout(){return <Outlet/>;}
