import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
type Props={children:ReactNode;name:string};
type State={failed:boolean};
export class PreschoolGameBoundary extends Component<Props,State>{
 state:State={failed:false};
 static getDerivedStateFromError():State{return{failed:true}};
 componentDidCatch(error:Error, info:ErrorInfo){console.error("[PISIPOUK preschool] "+this.props.name+" failed:",error,info.componentStack);}
 componentDidUpdate(prev:Props){if(prev.name!==this.props.name&&this.state.failed)this.setState({failed:false});}
 render(){
  if(!this.state.failed)return this.props.children;
  return <section role="alert" style={{maxWidth:900,margin:"24px auto",padding:"34px 22px",borderRadius:24,background:"#fff6e9",color:"#745440",textAlign:"center"}}>
   <AlertTriangle size={28} aria-hidden="true"/>
   <h2 style={{fontWeight:900,fontSize:23,margin:"12px 0"}}>Αυτή η δραστηριότητα χρειάζεται επανεκκίνηση</h2>
   <p style={{lineHeight:1.65}}>Το παιχνίδι αντιμετώπισε ένα σφάλμα. Οι υπόλοιποι κόσμοι παραμένουν διαθέσιμοι.</p>
   <button style={{display:"inline-flex",alignItems:"center",gap:8,background:"#316e55",color:"white",padding:"13px 18px",border:"none",borderRadius:13,fontWeight:900}} onClick={()=>this.setState({failed:false})}><RotateCcw size={17}/> Δοκίμασε ξανά</button>
  </section>;
 }
}
