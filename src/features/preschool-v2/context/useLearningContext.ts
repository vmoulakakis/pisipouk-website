import {useEffect,useState} from "react";
import {athensToday,PLACES,type PlaceKey} from "./awareness";
const STORE="pisipouk-world-v2-broad-region";
const SIGNAL="pisipouk-region-selected";
export function useLearningContext(){
 const [place,setPlace]=useState<PlaceKey>("city");
 const [today,setToday]=useState<string>(()=>athensToday());
 useEffect(()=>{
  try{const stored=window.localStorage.getItem(STORE);
   if(PLACES.some(x=>x.id===stored))setPlace(stored as PlaceKey);
  }catch{}
  const update=()=>{try{const x=window.localStorage.getItem(STORE);if(PLACES.some(p=>p.id===x))setPlace(x as PlaceKey)}catch{}};
  window.addEventListener(SIGNAL,update);
  window.addEventListener("storage",update);
  const tick=window.setInterval(()=>{setToday(athensToday())},60_000);
  return ()=>{window.clearInterval(tick);window.removeEventListener(SIGNAL,update);window.removeEventListener("storage",update)};
 },[]);
 const choose=(next:PlaceKey)=>{
  if(!PLACES.some(p=>p.id===next))return;
  setPlace(next);
  try{window.localStorage.setItem(STORE,next);window.dispatchEvent(new Event(SIGNAL))}catch{}
 };
 return {place,setPlace:choose,today};
}
