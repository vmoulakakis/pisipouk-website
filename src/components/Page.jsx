import { motion } from 'framer-motion'
export default function Page({children}){return <motion.main initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.4,ease:[.25,1,.5,1]}}>{children}</motion.main>}
export function Reveal({children,className=''}){return <motion.div className={className} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:.65,ease:[.25,1,.5,1]}}>{children}</motion.div>}
