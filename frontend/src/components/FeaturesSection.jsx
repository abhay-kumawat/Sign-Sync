import { motion } from 'framer-motion'

const features = [
  {
    icon: '✋',
    title: 'Gesture Recognition',
    desc: 'MediaPipe Hands tracks 21 key landmarks in real-time, translating ASL gestures to text with high accuracy.',
    color: 'from-purple-600/20 to-purple-900/5',
    border: 'border-purple-500/20',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    icon: '🧠',
    title: 'AI Memory System',
    desc: 'FastAPI backend retains conversation context so Stacy remembers your history and gives personalized responses.',
    color: 'from-cyan-600/20 to-cyan-900/5',
    border: 'border-cyan-500/20',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    icon: '😊',
    title: 'Emotion Detection',
    desc: 'MediaPipe Face Mesh analyzes 468 facial landmarks to detect your real-time emotion and adapt Stacy\'s response.',
    color: 'from-amber-600/20 to-amber-900/5',
    border: 'border-amber-500/20',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    icon: '🤖',
    title: '3D Avatar — Stacy',
    desc: 'A fully animated 3D avatar that lip-syncs, mirrors your emotion, gestures, and speaks back to you in real-time.',
    color: 'from-rose-600/20 to-rose-900/5',
    border: 'border-rose-500/20',
    glow: 'rgba(244,63,94,0.15)',
  },
  {
    icon: '🎤',
    title: 'Voice Synthesis',
    desc: "Emotion-aware voice output powered by the Web Speech API — Stacy's tone adapts to detected emotions dynamically.",
    color: 'from-green-600/20 to-green-900/5',
    border: 'border-green-500/20',
    glow: 'rgba(34,197,94,0.15)',
  },
  {
    icon: '⚡',
    title: 'Real-time Pipeline',
    desc: "Sub-100ms gesture-to-response pipeline with WebSocket streaming ensures no lag between your sign and Stacy's reply.",
    color: 'from-indigo-600/20 to-indigo-900/5',
    border: 'border-indigo-500/20',
    glow: 'rgba(99,102,241,0.15)',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-purple px-4 py-2 rounded-full text-sm text-purple-300 font-medium mb-6">
            🚀 Powered by Cutting-Edge AI
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-[Outfit] mb-4">
            Everything you need to <span className="gradient-text">communicate freely</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            SignSync combines computer vision, NLP, and 3D animation into one seamless experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} cursor-default group overflow-hidden`}
              style={{ boxShadow: `0 4px 40px ${f.glow}` }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${f.glow} 0%, transparent 70%)` }} />
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 font-[Outfit]">{f.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
