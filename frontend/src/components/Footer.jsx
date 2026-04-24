import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">✋</span>
          <span className="font-bold font-[Outfit]">Sign<span className="gradient-text-purple">Sync</span></span>
        </Link>
        <p className="text-white/35 text-sm text-center">
          Built with ❤️ · MediaPipe · FastAPI · React Three Fiber · Framer Motion
        </p>
        <div className="flex gap-6 text-white/40 text-sm">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
          <Link to="/app" className="hover:text-purple-300 transition-colors">Launch App</Link>
        </div>
      </div>
    </footer>
  )
}
