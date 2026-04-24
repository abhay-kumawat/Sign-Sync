import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Avatar3D from '../components/Avatar3D'

export default function AvatarShowcase() {
  const [emotion, setEmotion] = useState('neutral')
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)

  const emotions = [
    { name: 'neutral', icon: '😐', color: '#9D8FA8' },
    { name: 'happy', icon: '😊', color: '#FFD700' },
    { name: 'surprised', icon: '😮', color: '#FF69B4' },
    { name: 'focused', icon: '🎯', color: '#87CEEB' }
  ]

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 2000)
    }, 4000)

    return () => clearInterval(interval)
  }, [autoPlay])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Meet Stacy — Your 3D AI Avatar
          </h1>
          <p className="text-xl text-gray-300">
            A humanized AI assistant with realistic emotions, gestures, and sign language animations
          </p>
        </motion.div>

        {/* Main Avatar Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="glass border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden" style={{ height: '500px' }}>
              <Avatar3D emotion={emotion} isAnimating={isAnimating} />
            </div>
            
            {/* Status Info */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">{emotions.find(e => e.name === emotion)?.icon}</div>
                <p className="text-sm text-gray-400">Current Emotion</p>
                <p className="text-white font-semibold capitalize">{emotion}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">{isAnimating ? '✋' : '😴'}</div>
                <p className="text-sm text-gray-400">State</p>
                <p className="text-white font-semibold">{isAnimating ? 'Signing' : 'Idle'}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm text-gray-400">Auto-Play</p>
                <p className="text-white font-semibold">{autoPlay ? 'Enabled' : 'Paused'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Emotion Controls */}
          <div className="glass border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Select Emotion</h2>
            <div className="space-y-3">
              {emotions.map((e) => (
                <motion.button
                  key={e.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEmotion(e.name)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    emotion === e.name
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl mr-3">{e.icon}</span>
                  <span className="capitalize font-semibold">{e.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Animation Controls */}
          <div className="glass border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Control Animation</h2>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsAnimating(true)
                  setTimeout(() => setIsAnimating(false), 2000)
                }}
                className="w-full p-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                ✋ Start Signing
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAnimating(false)}
                className="w-full p-4 rounded-lg bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                ⏹️ Stop Animation
              </motion.button>

              <div className="flex gap-3 pt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={`flex-1 p-4 rounded-lg font-semibold transition-all ${
                    autoPlay
                      ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                      : 'bg-white/10 text-gray-300 border border-white/20'
                  }`}
                >
                  {autoPlay ? '▶️ Auto-Play ON' : '⏸️ Auto-Play OFF'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass border border-white/10 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Avatar Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="text-lg font-bold text-white mb-2">Emotion Recognition</h3>
              <p className="text-gray-400">Detects and responds to 4 emotions with color changes and facial expressions</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">✋</div>
              <h3 className="text-lg font-bold text-white mb-2">ASL Gestures</h3>
              <p className="text-gray-400">Plays realistic signing animations mapped to detected hand gestures</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">Humanization Engine</h3>
              <p className="text-gray-400">Smooth breathing, head tracking, and realistic idle movements</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="text-lg font-bold text-white mb-2">Lip-Sync</h3>
              <p className="text-gray-400">Mouth movements synced with voice responses and audio</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">💫</div>
              <h3 className="text-lg font-bold text-white mb-2">Auto-Fingerspelling</h3>
              <p className="text-gray-400">Hand positions transition smoothly between gesture states</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg border border-white/10">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-white mb-2">3D Rendering</h3>
              <p className="text-gray-400">Built with React Three Fiber for smooth 60fps animation</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <a
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-105"
          >
            🚀 Experience Stacy Now
          </a>
        </motion.div>
      </div>
    </div>
  )
}
