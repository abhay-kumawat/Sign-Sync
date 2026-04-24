import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MicView({ isListening, setIsListening, onResult, onAudioLevel, compact = false }) {
  const [supported, setSupported] = useState(true)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onstart = () => {
      setTranscript('')
      setIsProcessing(false)
      // Initialize audio analysis
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)()
          const analyser = audioContext.createAnalyser()
          const source = audioContext.createMediaStreamSource(stream)
          source.connect(analyser)
          analyser.fftSize = 256

          audioContextRef.current = audioContext
          analyserRef.current = analyser
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)

          // Start monitoring audio levels
          const monitor = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArrayRef.current)
              const average =
                dataArrayRef.current.reduce((a, b) => a + b) / dataArrayRef.current.length
              const level = Math.min(average / 255, 1)
              setAudioLevel(level)
              onAudioLevel?.(level)
              animationFrameRef.current = requestAnimationFrame(monitor)
            }
          }
          monitor()
        })
        .catch((err) => console.error('Audio access denied:', err))
    }

    rec.onresult = (e) => {
      let interim = ''
      let final = ''

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript
        if (e.results[i].isFinal) {
          final += text + ' '
        } else {
          interim += text
        }
      }

      setTranscript(final || interim)
    }

    rec.onend = () => {
      setIsListening(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      setAudioLevel(0)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      // Send final transcript if exists
      if (transcript.trim()) {
        setIsProcessing(true)
        setTimeout(() => {
          onResult?.(transcript.trim())
          setTranscript('')
          setIsProcessing(false)
        }, 500)
      }
    }

    rec.onerror = (e) => {
      console.error('Speech recognition error:', e.error)
      setIsListening(false)
      setAudioLevel(0)
    }

    recognitionRef.current = rec
  }, [onResult, transcript, onAudioLevel])

  const startListening = () => {
    if (!supported || isProcessing) return
    setTranscript('')
    recognitionRef.current?.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (!supported) return
    recognitionRef.current?.stop()
    setIsListening(false)
    setIsProcessing(true)
    // Stop audio monitoring
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setAudioLevel(0)
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {isListening && (
          <div className="flex items-center gap-1 h-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                className="w-1 rounded-full bg-purple-400"
              />
            ))}
          </div>
        )}
        <motion.button
          onClick={isListening ? stopListening : startListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-all duration-300 ${
            isListening 
              ? 'bg-red-500/10 border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
          }`}
        >
          <span className="text-sm">{isListening ? '⏹ Stop' : '🎤 Mic Off'}</span>
          {isListening && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          )}
        </motion.button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl"
          >
            {/* Animated listening icon */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                {/* Outer pulse rings */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1.3], opacity: [0.8, 0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-purple-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.15], opacity: [0.6, 0.2] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400"
                />

                {/* Main button */}
                <motion.div
                  animate={{ scale: 1 + audioLevel * 0.1 }}
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-4xl shadow-lg shadow-red-500/50 cursor-pointer"
                  onClick={stopListening}
                >
                  ⏹
                </motion.div>
              </div>
            </div>

            {/* Audio level visualization */}
            <div className="flex items-center justify-center gap-1 h-10 mb-6 bg-black/30 rounded-lg p-2">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: audioLevel > 0 ? Math.random() * audioLevel * 40 + 4 : 4,
                  }}
                  transition={{ duration: 0.1 }}
                  className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-purple-400"
                />
              ))}
            </div>

            {/* Status */}
            <div className="text-center mb-4">
              <p className="text-lg font-semibold text-purple-300">Listening...</p>
              <p className="text-xs text-white/50 mt-1">
                {audioLevel > 0.3 ? '🔊 Speaking detected' : '🎤 Waiting for speech'}
              </p>
            </div>

            {/* Transcript display */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 rounded-xl p-4 mb-4 border border-white/10 min-h-16"
              >
                <p className="text-sm text-white/90 italic">{transcript}</p>
              </motion.div>
            )}

            {/* Stop button */}
            <motion.button
              onClick={stopListening}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-red-500/40 transition-all"
            >
              Stop Speaking
            </motion.button>

            <p className="text-xs text-white/40 text-center mt-4">Click stop or wait 2 seconds after speaking</p>
          </motion.div>
        </motion.div>
      )}

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
