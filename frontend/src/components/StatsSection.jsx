import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 98, suffix: '%', label: 'Gesture Accuracy', icon: '✋' },
  { value: 60, suffix: '+', label: 'ASL Signs Supported', icon: '🤟' },
  { value: 100, suffix: 'ms', label: 'Response Latency', icon: '⚡' },
  { value: 468, suffix: '', label: 'Face Landmarks Tracked', icon: '😊' },
]

function CountUp({ target, suffix, inView }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 50
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 30)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span>{count}{suffix}</span>
}

export default function StatsSection() {
  const [inView, setInView] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-3xl p-10 border border-white/8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-500/5" />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-4xl font-black font-[Outfit] gradient-text mb-1">
                  <CountUp target={s.value} suffix={s.suffix} inView={inView} />
                </div>
                <div className="text-sm text-white/50">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
