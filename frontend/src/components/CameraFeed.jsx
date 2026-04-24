import { useRef, useEffect, useState } from 'react'
import { Hands } from '@mediapipe/hands'

export default function CameraFeed({ onGesture, onEmotion }) {
  const videoRef = useRef()
  const canvasRef = useRef()
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const lastGestureRef = useRef(null)
  const gestureTimeoutRef = useRef(null)
  const handsRef = useRef(null)
  const frameLoopRef = useRef(false)

  // Get finger extension state
  const getFingerState = (landmarks, handednessLabel = 'Right') => {
    if (!landmarks || landmarks.length < 21) return {}
    const isRightHand = handednessLabel === 'Right'

    return {
      // Thumb extension differs for left/right hands.
      thumb: isRightHand
        ? landmarks[4].x < landmarks[3].x
        : landmarks[4].x > landmarks[3].x,
      index: landmarks[8].y < landmarks[6].y,
      middle: landmarks[12].y < landmarks[10].y,
      ring: landmarks[16].y < landmarks[14].y,
      pinky: landmarks[20].y < landmarks[18].y,
    }
  }

  // Calculate distance between two points
  const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  // Count extended fingers
  const countExtendedFingers = (landmarks, handednessLabel) => {
    if (!landmarks || landmarks.length < 21) return 0
    const fingers = getFingerState(landmarks, handednessLabel)
    return Object.values(fingers).filter(Boolean).length
  }

  // Detect gesture from hand landmarks
  const detectGesture = (landmarks, handednessLabel) => {
    if (!landmarks || landmarks.length < 21) return null

    const fingers = getFingerState(landmarks, handednessLabel)
    const extendedCount = countExtendedFingers(landmarks, handednessLabel)
    
    // DISTANCE HELPERS
    const thumbIndexDist = distance(landmarks[4], landmarks[8])
    const thumbMiddleDist = distance(landmarks[4], landmarks[12])
    const thumbRingDist = distance(landmarks[4], landmarks[16])
    const thumbPinkyDist = distance(landmarks[4], landmarks[20])
    const indexMiddleDist = distance(landmarks[8], landmarks[12])

    // NUMBERS 0-9
    // 0: All tips touching (forming O)
    if (thumbIndexDist < 0.05 && thumbMiddleDist < 0.05 && thumbRingDist < 0.05 && thumbPinkyDist < 0.05) return '0'
    if (extendedCount === 1 && fingers.index && !fingers.thumb) return '1'
    if (extendedCount === 2 && fingers.index && fingers.middle && !fingers.thumb && indexMiddleDist > 0.05) return '2'
    if (extendedCount === 3 && fingers.index && fingers.middle && fingers.ring && !fingers.thumb) return '3'
    if (extendedCount === 4 && fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) return '4'
    if (extendedCount === 5) return '5'
    
    // 6-9 (Specific finger touching thumb)
    if (thumbPinkyDist < 0.05 && fingers.index && fingers.middle && fingers.ring) return '6'
    if (thumbRingDist < 0.05 && fingers.index && fingers.middle && fingers.pinky) return '7'
    if (thumbMiddleDist < 0.05 && fingers.index && fingers.ring && fingers.pinky) return '8'
    if (thumbIndexDist < 0.05 && fingers.middle && fingers.ring && fingers.pinky) return '9'

    // ALPHABETS A-Z
    // A: Fist with thumb on side
    if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && fingers.thumb) return 'A'
    
    // B: Open hand, thumb tucked
    if (fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) return 'B'
    
    // C: Curved shape
    if (thumbIndexDist > 0.1 && thumbIndexDist < 0.2 && !fingers.index && !fingers.middle) return 'C'
    
    // D: Index up, others curled
    if (fingers.index && thumbMiddleDist < 0.05 && !fingers.middle && !fingers.ring && !fingers.pinky) return 'D'

    // E: All fingers curled, tips touching thumb tip area
    if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb && 
        landmarks[8].y > landmarks[6].y && landmarks[4].y < landmarks[8].y) return 'E'

    // F: Thumb and Index touching, others up
    if (thumbIndexDist < 0.05 && fingers.middle && fingers.ring && fingers.pinky) return 'F'

    // G: Index and Thumb pointing sideways (horizontal)
    if (Math.abs(landmarks[8].y - landmarks[4].y) < 0.1 && !fingers.middle && !fingers.ring) return 'G'

    // H: Index and Middle pointing sideways
    if (Math.abs(landmarks[8].y - landmarks[12].y) < 0.05 && !fingers.ring && !fingers.pinky) return 'H'

    // I: Pinky up only
    if (fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring) return 'I'

    // K: Index and Middle up, Thumb touching Middle
    if (fingers.index && fingers.middle && thumbMiddleDist < 0.05 && !fingers.ring) return 'K'

    // L: Thumb and Index up
    if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring) return 'L'

    // M: Thumb under 3 fingers (Logic simplified: 3 fingers down over thumb)
    if (!fingers.index && !fingers.middle && !fingers.ring && landmarks[4].x > landmarks[14].x) return 'M'

    // O: Circle with all fingers
    if (thumbIndexDist < 0.05 && thumbMiddleDist < 0.05) return 'O'

    // R: Index and Middle crossed
    if (fingers.index && fingers.middle && landmarks[8].x > landmarks[12].x) return 'R'

    // S: Fist (thumb over fingers)
    if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb) return 'S'

    // V & U
    if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
      return (indexMiddleDist > 0.07) ? 'V' : 'U'
    }

    // W: Index, Middle, Ring up
    if (fingers.index && fingers.middle && fingers.ring && !fingers.pinky) return 'W'

    // X: Index hooked
    if (landmarks[8].y > landmarks[7].y && !fingers.middle && !fingers.ring) return 'X'

    // Y: Thumb and Pinky up
    if (fingers.thumb && fingers.pinky && !fingers.index && !fingers.middle) return 'Y'

    // CONTROL GESTURES
    // Confirm (Thumbs up)
    if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && landmarks[4].y < landmarks[3].y) return 'CONFIRM'
    
    // Cancel (Thumbs down)
    if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && landmarks[4].y > landmarks[3].y) return 'CANCEL'

    // I Love You
    if (fingers.thumb && fingers.index && fingers.pinky && !fingers.middle && !fingers.ring) return 'I LOVE YOU'

    // YOU (Pointing Index out/forward)
    if (fingers.index && !fingers.thumb && !fingers.middle && !fingers.ring && !fingers.pinky && landmarks[8].y < landmarks[5].y) return 'YOU'

    // NO (Index and Middle tapping Thumb)
    if (thumbIndexDist < 0.06 && thumbMiddleDist < 0.06 && !fingers.ring && !fingers.pinky) return 'NO'

    return null
  }

  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setScanning(true)
      setTimeout(() => setScanning(false), 300)

      const primaryHand = results.multiHandLandmarks[0]
      const handednessLabel = results.multiHandedness?.[0]?.label || 'Right'
      const gesture = detectGesture(primaryHand, handednessLabel)

      if (gesture && gesture !== lastGestureRef.current) {
        lastGestureRef.current = gesture
        onGesture?.(gesture)

        if (gestureTimeoutRef.current) clearTimeout(gestureTimeoutRef.current)
        gestureTimeoutRef.current = setTimeout(() => {
          lastGestureRef.current = null
        }, 1000)
      }
    }
  }

  // Initialize MediaPipe Hands
  useEffect(() => {
    try {
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      })

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })

      hands.onResults(onResults)
      handsRef.current = hands

      // Start camera access
      navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } }
      }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
            const sendFrames = async () => {
              if (!frameLoopRef.current) return
              if (handsRef.current && videoRef.current) {
                try {
                  await handsRef.current.send({ image: videoRef.current })
                } catch (err) {
                  console.error('Error sending frame:', err)
                }
              }
              requestAnimationFrame(sendFrames)
            }
            frameLoopRef.current = true
            sendFrames()
            setActive(true)
          }
        }
      }).catch(err => {
        setError('Camera access denied. Please allow camera access.')
        console.error('Camera error:', err)
      })
    } catch (err) {
      console.error('Failed to initialize MediaPipe:', err)
      setError('Hand detection module failed to load.')
    }

    return () => {
      frameLoopRef.current = false
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks?.() || []
        tracks.forEach((track) => track.stop())
      }
      if (gestureTimeoutRef.current) {
        clearTimeout(gestureTimeoutRef.current)
      }
    }
  }, [])

  // Random emotion changes
  useEffect(() => {
    if (!active) return
    const emotions = ['happy', 'neutral', 'surprised', 'focused']
    const interval = setInterval(() => {
      onEmotion?.(emotions[Math.floor(Math.random() * emotions.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [active, onEmotion])

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass border border-white/10">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Canvas for drawing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
          <span className="text-4xl">📷</span>
          <p className="text-white/60 text-sm text-center px-4">{error}</p>
        </div>
      )}

      {/* Overlay UI */}
      {active && (
        <>
          {/* Corner brackets */}
          {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6`}>
              <div
                className={`absolute inset-0 border-purple-400 border-opacity-80 ${i < 2 ? 'border-t-2' : 'border-b-2'} ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'} rounded-sm`}
              />
            </div>
          ))}

          {/* Scan line when detecting */}
          {scanning && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="scan-line absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80" />
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 glass-purple px-3 py-1 rounded-full text-xs text-purple-300 flex items-center gap-1.5">
            {scanning ? (
              <>
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Interpreter Ready
              </>
            )}
          </div>

          {/* Hand zone indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-[10px] text-white/50 font-bold uppercase tracking-widest">
            ✋ A-Z, 0-9, Core Words
          </div>
        </>
      )}
    </div>
  )
}
