import { motion, AnimatePresence } from 'framer-motion'

export default function Avatar3D({ emotion = 'neutral' }) {
  const emotionConfig = {
    happy: { 
      color: '#fbbf24', 
      gradient: 'from-amber-400/40 to-orange-500/40',
      shadow: '0 0 40px rgba(251, 191, 36, 0.3)',
      eyeScaleY: 0.6,
      eyeY: 2,
      mouthPath: "M 20 60 Q 50 85 80 60",
      blush: true
    },
    neutral: { 
      color: '#8b5cf6', 
      gradient: 'from-purple-500/40 to-indigo-600/40',
      shadow: '0 0 40px rgba(139, 92, 246, 0.3)',
      eyeScaleY: 1,
      eyeY: 0,
      mouthPath: "M 30 65 Q 50 65 70 65",
      blush: false
    },
    surprised: { 
      color: '#06b6d4', 
      gradient: 'from-cyan-400/40 to-blue-500/40',
      shadow: '0 0 40px rgba(6, 182, 212, 0.3)',
      eyeScaleY: 1.2,
      eyeY: -5,
      mouthPath: "M 40 70 A 10 10 0 1 0 60 70 A 10 10 0 1 0 40 70",
      blush: false
    },
    focused: { 
      color: '#10b981', 
      gradient: 'from-emerald-400/40 to-teal-500/40',
      shadow: '0 0 40px rgba(16, 185, 129, 0.3)',
      eyeScaleY: 0.3,
      eyeY: 2,
      mouthPath: "M 35 65 L 65 65",
      blush: false
    },
    sad: { 
      color: '#3b82f6', 
      gradient: 'from-blue-400/40 to-indigo-500/40',
      shadow: '0 0 40px rgba(59, 130, 246, 0.3)',
      eyeScaleY: 0.8,
      eyeY: 3,
      mouthPath: "M 30 75 Q 50 60 70 75",
      blush: false
    },
  }

  const config = emotionConfig[emotion] || emotionConfig.neutral
  const safeConfig = {
    color: config.color || '#8b5cf6',
    gradient: config.gradient || 'from-purple-500/40 to-indigo-600/40',
    shadow: config.shadow || '0 0 40px rgba(139, 92, 246, 0.3)',
    eyeScaleY: config.eyeScaleY ?? 1,
    eyeY: config.eyeY ?? 0,
    mouthPath: config.mouthPath || "M 30 65 Q 50 65 70 65",
    blush: config.blush ?? false
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-[#030712] overflow-hidden p-8">
      {/* AI Interpreter Label */}
      <div className="absolute top-8 left-8">
        <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1 block">AI Interpreter</span>
        <h2 className="text-3xl font-bold text-white tracking-tight">Stacy</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-green-500/80 font-bold uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full">
        {/* Horizontal Neural Waves */}
        <div className="absolute inset-x-0 flex items-center justify-center gap-1 opacity-40">
           {[...Array(40)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 height: emotion === 'neutral' ? [4, 8, 4] : [4, Math.random() * 40 + 10, 4],
                 opacity: [0.2, 0.5, 0.2]
               }}
               transition={{ 
                 duration: 1.5, 
                 repeat: Infinity, 
                 delay: Math.abs(20 - i) * 0.05 
               }}
               className="w-0.5 rounded-full bg-cyan-400"
             />
           ))}
        </div>

        {/* The Avatar Ring */}
        <div className="relative z-10">
          {/* Outer Glow Ring */}
          <motion.div
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(168,85,247,0.4)',
                '0 0 40px rgba(6,182,212,0.6)',
                '0 0 20px rgba(168,85,247,0.4)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-purple-500/30 flex items-center justify-center overflow-hidden relative"
          >
            {/* Inner Gradient Border */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-tr from-purple-500 via-cyan-400 to-purple-600 [mask-composite:exclude] p-[4px] pointer-events-none" />
            
            {/* 3D Avatar Image */}
            <img 
              src="/stacy_avatar.png" 
              alt="Stacy AI"
              className="w-full h-full object-cover scale-110"
            />

            {/* Dynamic Emotion Overlay (Subtle) */}
            <div className={`absolute inset-0 bg-gradient-to-t ${safeConfig.gradient} opacity-20`} />
          </motion.div>

          {/* Eye Blinks / Emotional HUD (Optional overlay) */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
             <div className="glass-purple px-4 py-1 rounded-full border border-purple-500/20">
               <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{emotion === 'neutral' ? 'Listening' : emotion}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
