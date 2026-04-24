import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import CameraFeed from '../components/CameraFeed'
import ChatBox from '../components/ChatBox'
import MicView from '../components/MicView'
import AvatarView from '../components/AvatarView'
import UserGuide from '../components/UserGuide'

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! 👋 I\'m Stacy, your AI sign language assistant. Show me a hand gesture or speak to get started!' }
  ])
  const [guideOpen, setGuideOpen] = useState(false)
  const [emotion, setEmotion] = useState('neutral')
  const [isListening, setIsListening] = useState(false)
  const [gestureText, setGestureText] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const gestureTimeoutRef = useRef(null)
  const speakingTimeoutRef = useRef(null)

  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    
    // If AI is responding, trigger speaking animation
    if (role === 'ai') {
      setIsSpeaking(true)
      if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current)
      // Keep speaking animation for 2-3 seconds (simulate response time)
      speakingTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false)
      }, 2000 + Math.random() * 1000)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#030712] text-white overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.2) 0%, transparent 60%), #030712' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 flex-shrink-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-base">✋</span>
          </div>
          <span className="font-bold font-[Outfit] text-xl tracking-tight">Sign<span className="text-purple-500">Sync</span></span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass-purple px-4 py-1.5 rounded-full text-[10px] text-purple-300 uppercase tracking-widest font-bold">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            Live · {emotion}
          </div>

          <MicView 
            isListening={isListening} setIsListening={setIsListening} 
            onResult={(text) => {
              addMessage('user', text)
              setEmotion('focused')
              const tid = Date.now()
              setMessages(prev => [...prev, { id: tid, role: 'ai', text: '...', isThinking: true }])
              setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== tid))
                addMessage('ai', getAIReply(text))
                setIsSpeaking(true)
                setEmotion('happy')
              }, 1800)
            }} 
            onAudioLevel={setAudioLevel} 
            compact={true} 
          />

          <button 
            onClick={() => setGuideOpen(true)}
            className="glass-dark px-6 py-2 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white/80"
          >
            Guide
          </button>
        </div>
      </div>

      {/* Main layout - 50/50 Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL — Camera Feed (Full Height) */}
        <div className="w-1/2 relative border-r border-white/5">
          <CameraFeed onGesture={(text) => {
            setGestureText(text)
            if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current)
            gestureTimeoutRef.current = setTimeout(() => setGestureText(''), 3000) // Keep HUD longer
            
            if (text && text !== 'Hand Detected') {
              // Add a "Thinking" state to Stacy
              setEmotion('focused')
              
              // Remove any existing thinking message if user is rapid-signing
              setMessages(prev => prev.filter(m => !m.isThinking))
              
              // Thinking placeholder
              const thinkingId = Date.now()
              setMessages(prev => [...prev, { id: thinkingId, role: 'ai', text: '...', isThinking: true }])
              
              setTimeout(() => {
                setMessages(prev => prev.filter(m => m.id !== thinkingId))
                addMessage('ai', getAIReply(text))
                setEmotion('happy')
              }, 1800) // Slow down Stacy
            }
          }} onEmotion={setEmotion} />
          {/* Premium Gesture HUD overlay */}
          <AnimatePresence>
            {gestureText && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-8 left-8 z-30 flex items-center gap-4 glass-purple px-6 py-3 rounded-2xl border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <span className="text-xl">✋</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#030712] animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-purple-300/80 font-bold">Scanning Hand</span>
                  <span className="text-xl font-black text-white tracking-tight">{gestureText}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner accents for pro look */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-xl pointer-events-none" />
        </div>

        {/* RIGHT PANEL — Vertical Layout (Avatar + Transcript) */}
        <div className="w-1/2 flex flex-col bg-[#030712] border-l border-white/5">
          {/* Top Section: Avatar Hub */}
          <div className="flex-[1.2] min-h-[400px] border-b border-white/5 relative">
            <AvatarView emotion={emotion} isSpeaking={isSpeaking} gesture={gestureText} isListening={isListening} audioLevel={audioLevel} />
          </div>
          
          {/* Bottom Section: Live Transcript Hub */}
          <div className="flex-1 min-h-[300px] p-6 bg-[#030712]">
            <div className="h-full glass-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              {/* Transcript Header */}
              <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <span className="text-[10px]">💬</span>
                  </div>
                  <span className="text-[11px] uppercase tracking-widest text-white/70 font-bold">Live Transcript</span>
                </div>
                <div className="flex items-center gap-3">
                   {emotion === 'focused' && (
                     <div className="flex gap-1 mr-2">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                     </div>
                   )}
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-hidden p-2">
                <ChatBox messages={messages} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Controls: Mic Toggle & Help */}
      {/* Moved into Top Bar to prevent overlaps */}

      {/* Overlays */}
      {guideOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-8">
          <UserGuide onClose={() => setGuideOpen(false)} />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------
// AI Response Logic (getAIReply)
// ---------------------------------------------------------
function getAIReply(input) {
  const rawInput = input.toLowerCase()
  const sign = input.toUpperCase()

  if (sign === 'HAND DETECTED') {
    return 'I see your hand! Try making a clearer sign like A, B, or 1-5.'
  }

  // ALPHABET RESPONSES
  const alphabetResponses = {
    'A': "Letter A! 👊 Good start.",
    'B': "That's B! 🖐️ Nice and flat.",
    'C': "C recognized! ✊ Perfect curve.",
    'D': "D is correct! ☝️ Pointing up.",
    'E': "Letter E! ✊ Tucked in tight.",
    'F': "F detected! 🆗 Nice loop.",
    'G': "G identified! 👈 Sideways thumb.",
    'H': "Letter H! ✌️ Both fingers flat.",
    'I': "I see that I! 🤙 Just the pinky.",
    'J': "J recognized! (Remember the hook motion!)",
    'K': "K detected! ✌️ Middle finger touch.",
    'L': "L is perfect! 👍 That's an easy one.",
    'M': "M identified! 👊 Three fingers over.",
    'N': "N recognized! 👊 Two fingers over.",
    'O': "O shape! 🆗 Perfect circle.",
    'P': "P identified! 🤌 Like a downward K.",
    'Q': "Q detected! 🤏 Pointing down.",
    'R': "R is correct! 🤞 Fingers crossed.",
    'S': "Letter S! ✊ Tight fist.",
    'T': "T recognized! 👊 Thumb tucked.",
    'U': "U identified! ✌️ Fingers together.",
    'V': "V for Victory! ✌️ Fingers apart.",
    'W': "W detected! 🖐️ Three fingers up.",
    'X': "X recognized! ☝️ Hooked index.",
    'Y': "Y is perfect! 🤙 Thumb and pinky.",
    'Z': "Z recognized! (Try drawing it in the air!)"
  }

  if (sign.match(/^[A-Z]$/)) {
    return alphabetResponses[sign] || `Recognized ${sign}! Great work! 🌟`
  }

  // NUMBER RESPONSES
  const numberResponses = {
    '0': "Number 0! 🆗 A perfect circle.",
    '1': "Number 1! ☝️",
    '2': "Number 2! ✌️",
    '3': "Number 3! 🤟 Thumb out.",
    '4': "Number 4! ✋ Four fingers up.",
    '5': "Number 5! ✋ Full hand.",
    '6': "6 detected! 🤙 Pinky to thumb.",
    '7': "7 recognized! 🖖 Ring to thumb.",
    '8': "8 identified! 👌 Middle to thumb.",
    '9': "9 detected! 🆗 Index to thumb.",
    '10': "10! 🤙 A great thumbs up/shake."
  }

  if (input.match(/^[0-9]+$/)) {
    return numberResponses[input] || `Number ${input} detected! 👍`
  }

  // CORE WORDS & CONTROLS
  if (sign === 'CONFIRM') return '✅ Confirmed! Thumbs up for yes.'
  if (sign === 'CANCEL') return '❌ Cancelled. Thumbs down detected.'
  if (sign === 'I LOVE YOU') return '🤟 I love you too! That is the universal sign for love.'
  if (sign === 'YOU') return '👉 You! I am here to help you learn.'
  if (sign === 'NO') return '🚫 No. Correct! (Index and Middle tapping thumb).'

  // Voice/Text Commands
  if (rawInput.includes('hello') || rawInput.includes('hi')) return '👋 Hi there! I am Stacy. Show me some signs!'
  if (rawInput.includes('thank')) return '😊 You are welcome! Happy to help!'
  if (rawInput.includes('name')) return '🤖 My name is Stacy, your AI interpreter.'
  if (rawInput.includes('help')) return '💡 Try A-Z or 0-9! I can also understand "I Love You" and "Thumbs Up".'

  return `💬 Interpreted: "${input}". Excellent sign! 🌟`
}
