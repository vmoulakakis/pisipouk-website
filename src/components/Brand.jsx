import { motion } from 'framer-motion'

export function Mascot({ className = '' }) {
  return (
    <motion.span aria-hidden="true" whileHover={{ rotate: [0, -8, 8, 0], scale: [1, 1.06, 1] }} className={`mascot ${className}`}>
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <path d="M32 6c4 0 7 7 10 9 4 2 11-1 14 2 3 3 0 10 2 14 2 3 9 6 9 10 0 5-8 7-11 10-3 3-2 11-7 13-4 2-10-4-15-4-5 0-11 6-15 4-5-2-4-10-7-13-3-3-11-5-11-10 0-4 7-7 9-10 2-4-1-11 2-14 3-3 10 0 14-2 3-2 6-9 10-9Z" fill="#FFD152"/>
        <circle cx="25" cy="31" r="2.2" fill="#2A2A2A"/><circle cx="39" cy="31" r="2.2" fill="#2A2A2A"/>
        <path d="M24 39c5 5 11 5 16 0" fill="none" stroke="#2A2A2A" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    </motion.span>
  )
}

export default function Brand() {
  return <span className="flex items-center gap-3"><Mascot className="h-10 w-10"/><span className="wordmark text-[1.65rem] leading-none">Πισιπούκ</span></span>
}
