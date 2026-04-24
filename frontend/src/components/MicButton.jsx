import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MicButton({ isListening, setIsListening, onResult }) {
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setSupported(false); return }
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript
      onResult?.(text)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
  }, [])

  const toggle = () => {
    if (!supported) return
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Pulse rings when active */}
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/60 animate-[pulse-ring_2s_ease-out_infinite]" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-[pulse-ring_2s_ease-out_0.5s_infinite]" />
          </>
        )}

        <motion.button
          id="mic-button"
          onClick={toggle}
          whileTap={{ scale: 0.92 }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl transition-all duration-300 ${
            isListening
              ? 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/40'
              : 'bg-gradient-to-br from-purple-600 to-violet-700 shadow-purple-500/40'
          }`}
          style={{ boxShadow: isListening ? '0 0 30px rgba(239,68,68,0.5)' : '0 0 30px rgba(124,58,237,0.4)' }}
        >
          {isListening ? '⏹' : '🎤'}
        </motion.button>
      </div>

      {/* Waveform */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="flex items-center gap-1"
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wave-bar w-1 rounded-full bg-purple-400"
                style={{ animationDelay: `${i * 0.15}s`, height: '8px' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <span className="text-xs text-white/40">
        {!supported ? 'Speech not supported' : isListening ? 'Listening…' : 'Tap to speak'}
      </span>
    </div>
  )
}
