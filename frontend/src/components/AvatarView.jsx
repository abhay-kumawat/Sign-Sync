import { motion } from 'framer-motion'
import Avatar3D from './Avatar3D'

const emotionConfig = {
  happy: { emoji: '😊', color: '#f59e0b', label: 'Happy', aura: 'rgba(245,158,11,0.2)' },
  neutral: { emoji: '😐', color: '#7c3aed', label: 'Neutral', aura: 'rgba(124,58,237,0.2)' },
  surprised: { emoji: '😲', color: '#06b6d4', label: 'Surprised', aura: 'rgba(6,182,212,0.2)' },
  focused: { emoji: '🧐', color: '#10b981', label: 'Focused', aura: 'rgba(16,185,129,0.2)' },
  sad: { emoji: '😢', color: '#3b82f6', label: 'Sad', aura: 'rgba(59,130,246,0.2)' },
}

export default function AvatarView({ emotion = 'neutral', isSpeaking, gesture = '', isListening = false, audioLevel = 0 }) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Stacy Avatar - Full Screen on right */}
      <div className="flex-1 overflow-hidden">
        <Avatar3D emotion={emotion} />
      </div>

      {/* Gesture Detected Badge */}
      {gesture && gesture !== 'Hand Detected' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-purple rounded-lg px-4 py-2 border border-purple-500/30 text-center"
        >
          <p className="text-purple-300 text-sm">✋ Detected Gesture:</p>
          <p className="text-white font-bold text-lg">{gesture}</p>
        </motion.div>
      )}

      {/* Speaking indicator & emotion badge */}
      {isSpeaking && (
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="wave-bar w-1.5 rounded-full bg-purple-400"
              style={{ animationDelay: `${i * 0.15}s`, height: '8px' }} />
          ))}
        </div>
      )}
    </div>
  )
}
