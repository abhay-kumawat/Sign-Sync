import { motion } from 'framer-motion'

const steps = [
  { num: '01', icon: '🎥', title: 'Allow Camera', desc: 'Grant camera access. MediaPipe activates and begins tracking your hand landmarks in real-time.' },
  { num: '02', icon: '✋', title: 'Show Your Sign', desc: 'Perform ASL gestures in front of the camera. 21 key hand points are tracked per frame.' },
  { num: '03', icon: '🧠', title: 'AI Interprets', desc: 'Our ML model classifies the gesture and converts it to text, passing context to the memory system.' },
  { num: '04', icon: '💬', title: 'Stacy Responds', desc: 'The FastAPI backend generates a personalized, emotion-aware response using your conversation history.' },
  { num: '05', icon: '😊', title: 'Avatar Reacts', desc: "Stacy's 3D face mirrors your detected emotion, lip-syncs to the response, and voices it aloud." },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass-purple px-4 py-2 rounded-full text-sm text-purple-300 font-medium mb-6">
            🔄 System Flow
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-[Outfit] mb-4">
            How <span className="gradient-text">SignSync</span> works
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Five steps from gesture to response — all in under 100ms.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-purple-500/50 via-cyan-500/30 to-transparent hidden lg:block" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex items-start gap-6 group"
              >
                {/* Step number circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl glass-purple border border-purple-500/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {step.num}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 glass rounded-2xl p-5 border border-white/8 group-hover:border-purple-500/30 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]">
                  <h3 className="text-lg font-bold font-[Outfit] mb-1">{step.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
