import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function StickyCTA(){return <Link to="/epikoinonia" className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full bg-earth px-5 py-3 text-sm font-bold text-white shadow-2xl md:flex"><CalendarDays size={18}/>Κλείσε Ραντεβού</Link>}
