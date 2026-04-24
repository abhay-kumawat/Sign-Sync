import { motion } from 'framer-motion'

const steps = [
  { icon: '🎥', title: 'Allow Camera', desc: 'Grant camera permission when prompted by the browser.' },
  { icon: '✋', title: 'Show Gestures', desc: 'Place your hand in the camera frame and perform ASL signs.' },
  { icon: '🧠', title: 'AI Detects', desc: 'MediaPipe tracks landmarks, the model classifies your gesture.' },
  { icon: '💬', title: 'Text Output', desc: 'Gesture is converted to text and sent to Stacy.' },
  { icon: '🤖', title: 'Stacy Responds', desc: 'The avatar replies with voice, expression, and animation.' },
]

export default function UserGuide({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="relative glass rounded-3xl border border-white/12 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 to-cyan-600/5 rounded-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black font-[Outfit]">📘 How to Use SignSync</h2>
          <button
            id="close-guide"
            onClick={onClose}
            className="w-8 h-8 rounded-full glass hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 flex-shrink-0 glass-purple rounded-xl flex items-center justify-center text-lg">
                {step.icon}
              </div>
              <div>
                <div className="font-semibold text-sm mb-0.5">{step.title}</div>
                <div className="text-xs text-white/50 leading-relaxed">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 glass-purple rounded-2xl p-4">
          <div className="text-sm font-semibold text-purple-300 mb-2">💡 Supported Gestures (Demo)</div>
          <div className="flex flex-wrap gap-2">
            {['Hello', 'Thank You', 'Help', 'Yes', 'No', 'Please', 'Sorry', 'Good', 'Name'].map(g => (
              <span key={g} className="text-xs glass px-3 py-1 rounded-full text-white/70">✋ {g}</span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary relative w-full mt-6 py-3 rounded-2xl font-semibold text-white"
        >
          <span className="relative z-10">Got it, let's go! →</span>
        </button>
      </div>
    </motion.div>
  )
}
