import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const floatVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: 'easeOut' }
  })
}

export default function HeroSection() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT — Text */}
        <div className="space-y-8">
          <motion.div custom={0} variants={floatVariants} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 glass-purple px-4 py-2 rounded-full text-sm text-purple-300 font-medium"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI-Powered Sign Language Bridge
          </motion.div>

          <motion.h1 custom={1} variants={floatVariants} initial="hidden" animate="visible"
            className="text-5xl sm:text-6xl lg:text-7xl font-black font-[Outfit] leading-[1.05] tracking-tight"
          >
            Break the{' '}
            <span className="gradient-text text-glow">Silence</span>
            <br />with{' '}
            <span className="text-white">SignSync</span>
          </motion.h1>

          <motion.p custom={2} variants={floatVariants} initial="hidden" animate="visible"
            className="text-lg text-white/60 leading-relaxed max-w-xl"
          >
            Real-time gesture detection meets emotionally intelligent AI. Show your hands — 
            Stacy reads your signs, understands your emotions, and responds with voice, expression, and soul.
          </motion.p>

          <motion.div custom={3} variants={floatVariants} initial="hidden" animate="visible"
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => navigate('/app')}
              className="btn-primary relative px-8 py-4 rounded-2xl text-base font-bold text-white shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                ✋ Try SignSync Live
              </span>
            </button>
            <a href="#how-it-works"
              className="btn-outline px-8 py-4 rounded-2xl text-base font-semibold text-white/80"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div custom={4} variants={floatVariants} initial="hidden" animate="visible"
            className="flex flex-wrap gap-6 text-sm text-white/40"
          >
            {['🧠 MediaPipe AI', '⚡ Real-time', '🎭 3D Avatar', '🔒 Privacy-first'].map(b => (
              <span key={b} className="flex items-center gap-1">{b}</span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="relative flex items-center justify-center"
        >
          {/* Outer ring */}
          <div className="relative w-80 h-80 lg:w-[420px] lg:h-[420px]">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-purple-500/15 animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-8 rounded-full border border-cyan-500/10 animate-[spin_10s_linear_infinite]" />

            {/* Center avatar mockup */}
            <div className="absolute inset-12 rounded-full glass glow-purple flex flex-col items-center justify-center">
              <div className="float text-center">
                <div className="text-7xl mb-2">🤖</div>
                <div className="text-xs text-purple-300 font-medium tracking-widest uppercase">Stacy AI</div>
              </div>
            </div>

            {/* Orbit dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {[
                  { emoji: '✋', angle: 0, r: 180, delay: '0s' },
                  { emoji: '🧠', angle: 90, r: 180, delay: '1.5s' },
                  { emoji: '💬', angle: 180, r: 180, delay: '3s' },
                  { emoji: '🎤', angle: 270, r: 180, delay: '4.5s' },
                ].map(({ emoji, angle, r, delay }, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(-50%,-50%) rotate(${angle}deg) translateX(${r / 2}px)`,
                    }}
                  >
                    <div className="glass-purple w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg animate-[float_4s_ease-in-out_infinite]"
                      style={{ animationDelay: delay }}>
                      {emoji}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scan line effect */}
            <div className="absolute inset-12 rounded-full overflow-hidden pointer-events-none">
              <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
            </div>
          </div>

          {/* Floating status cards */}
          <motion.div
            className="absolute -left-4 top-8 glass px-4 py-3 rounded-2xl border border-green-500/30"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-semibold">Gesture Detected</span>
            </div>
            <div className="text-sm font-bold mt-0.5 text-white">"Hello" ✋</div>
          </motion.div>

          <motion.div
            className="absolute -right-4 bottom-12 glass px-4 py-3 rounded-2xl border border-cyan-500/30"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs text-cyan-300 font-semibold">Stacy Responding</span>
            </div>
            <div className="text-sm font-bold mt-0.5 text-white">😊 "Hi there!"</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
