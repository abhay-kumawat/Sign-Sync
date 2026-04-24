import { motion } from 'framer-motion'

export default function DeafAccessSection() {
  const accessibilityFeatures = [
    {
      title: "Real-time Transcription",
      desc: "Instant speech-to-text with 98% accuracy, ensuring you never miss a word in a conversation.",
      icon: "✍️",
      color: "from-blue-500 to-cyan-400"
    },
    {
      title: "Visual Waveforms",
      desc: "Experience sound through visual pulses that react to the tone and volume of the speaker.",
      icon: "🌊",
      color: "from-purple-500 to-indigo-400"
    },
    {
      title: "Emotion Mirroring",
      desc: "Our AI avatar, Stacy, mirrors detected emotions to convey the sentiment behind the text.",
      icon: "🎭",
      color: "from-amber-400 to-orange-400"
    },
    {
      title: "Low-Latency Signs",
      desc: "Optimized gesture recognition that interprets ASL signs in under 100ms for natural flow.",
      icon: "⚡",
      color: "from-emerald-500 to-teal-400"
    }
  ]

  const useCases = [
    { title: "Daily Conversations", desc: "Break barriers with family and friends using real-time sign-to-text.", icon: "🏠" },
    { title: "Medical Visits", desc: "Ensure clear communication with healthcare professionals effortlessly.", icon: "🏥" },
    { title: "Educational Support", desc: "Enhance learning with visual AI assistance and instant feedback.", icon: "🎓" }
  ]

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-slate-950">
      {/* Neural Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Column: Copy */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-purple-400 font-bold tracking-[0.2em] text-sm uppercase mb-4 block">
                Accessibility First
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight font-[Outfit]">
                Empowering the <span className="gradient-text">Silent Community</span>
              </h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-xl">
                SignSync isn't just an app; it's a bridge. We've built specialized tools to ensure that every deaf and hard-of-hearing individual can communicate their way, with confidence and dignity.
              </p>

              <div className="space-y-6">
                {useCases.map((useCase, i) => (
                  <motion.div
                    key={useCase.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-default group"
                  >
                    <div className="text-2xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {useCase.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{useCase.title}</h4>
                      <p className="text-white/40 text-sm">{useCase.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Feature Cards */}
          <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {accessibilityFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-[2rem] glass border border-white/10 overflow-hidden group"
              >
                {/* Gradient Glow */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3 font-[Outfit]">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </div>

                {/* Bottom line decorator */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} w-0 group-hover:w-full transition-all duration-500`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 p-10 rounded-[3rem] bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-3xl border border-white/20 animate-pulse">
              ✋
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 font-[Outfit]">Ready to break the silence?</h3>
              <p className="text-white/40">Launch our specialized accessible interface now.</p>
            </div>
          </div>
          <a
            href="/app"
            className="px-10 py-5 bg-white text-black font-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            START FREE ACCESS
          </a>
        </motion.div>
      </div>
    </section>
  )
}
