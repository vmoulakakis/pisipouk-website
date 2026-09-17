import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import StickyCTA from './components/StickyCTA'
import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-cream text-earth">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/paroxes" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/epikoinonia" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <StickyCTA />
    </div>
  )
}
