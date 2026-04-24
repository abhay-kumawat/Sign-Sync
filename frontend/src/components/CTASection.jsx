import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CTASection() {
  const navigate = useNavigate()
  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl p-12 overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/25 via-purple-900/20 to-cyan-600/15 border border-purple-500/25 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-purple-500/20 blur-3xl" />

          <div className="relative space-y-6">
            <div className="text-6xl float inline-block">🤖</div>
            <h2 className="text-4xl sm:text-5xl font-black font-[Outfit]">
              Ready to meet <span className="gradient-text">Stacy?</span>
            </h2>
            <p className="text-white/55 text-lg max-w-xl mx-auto">
              Launch the app, allow camera access, and start signing. Stacy is waiting to understand you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/app')}
                className="btn-primary relative px-10 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl"
              >
                <span className="relative z-10">✋ Launch SignSync</span>
              </button>
            </div>
            <p className="text-white/30 text-sm">No login required · Works in browser · Free forever</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
