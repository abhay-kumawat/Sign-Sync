import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/10 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-lg font-black shadow-lg group-hover:scale-110 transition-transform">
              ✋
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
          </div>
          <span className="text-xl font-bold font-[Outfit]">
            Sign<span className="gradient-text-purple">Sync</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Demo'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 hover:text-purple-300"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/avatar')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20"
          >
            🤖 Meet Stacy
          </button>
          <button
            onClick={() => navigate('/app')}
            className="btn-primary relative z-10 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          >
            <span className="relative z-10">Launch App →</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <button className="md:hidden text-white/70" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10 px-6 py-4 space-y-3"
          >
            {['Features', 'How It Works', 'Demo'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-white/70 hover:text-white py-1">
                {item}
              </a>
            ))}
            <button onClick={() => navigate('/avatar')} className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-white mb-2">
              🤖 Meet Stacy
            </button>
            <button onClick={() => navigate('/app')} className="btn-primary w-full py-3 rounded-xl text-sm font-semibold">
              <span className="relative z-10">Launch App →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
