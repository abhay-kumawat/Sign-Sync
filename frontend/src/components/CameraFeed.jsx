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
    
    // Distance helpers for specific signs
    const thumbIndexDist = distance(landmarks[4], landmarks[8])
    const thumbMiddleDist = distance(landmarks[4], landmarks[12])
    const thumbRingDist = distance(landmarks[4], landmarks[16])
    const thumbPinkyDist = distance(landmarks[4], landmarks[20])

    // NUMBERS 1-5 (Simple extension)
    if (extendedCount === 1 && fingers.index && !fingers.thumb) return '1'
    if (extendedCount === 2 && fingers.index && fingers.middle && !fingers.thumb) return '2'
    if (extendedCount === 3 && fingers.index && fingers.middle && fingers.ring && !fingers.thumb) return '3'
    if (extendedCount === 4 && fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) return '4'
    if (extendedCount === 5) return '5'

    // NUMBERS 6-10
    if (thumbPinkyDist < 0.05 && fingers.index && fingers.middle && fingers.ring) return '6'
    if (thumbRingDist < 0.05 && fingers.index && fingers.middle && fingers.pinky) return '7'
    if (thumbMiddleDist < 0.05 && fingers.index && fingers.ring && fingers.pinky) return '8'
    if (thumbIndexDist < 0.05 && fingers.middle && fingers.ring && fingers.pinky) return '9'
    if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return '10'

    // ALPHABETS
    // A: Thumb out, others folded
    if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return 'A'
    
    // B: All fingers up, thumb tucked
    if (fingers.index && fingers.middle && fingers.ring && fingers.pinky && !fingers.thumb) return 'B'
    
    // C: Curved hand (Checking if tips are relatively close but not touching, forming a loop)
    const cShapeDist = distance(landmarks[4], landmarks[8])
    if (cShapeDist > 0.1 && cShapeDist < 0.2 && !fingers.index && !fingers.middle) return 'C'

    // D: Index up, others touching thumb
    if (fingers.index && thumbMiddleDist < 0.05 && !fingers.middle && !fingers.ring && !fingers.pinky) return 'D'

    // L: Thumb and Index out
    if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return 'L'

    // W: Index, Middle, Ring out
    if (fingers.index && fingers.middle && fingers.ring && !fingers.thumb && !fingers.pinky) return 'W'

    // Y: Thumb and Pinky out
    if (fingers.thumb && fingers.pinky && !fingers.index && !fingers.middle && !fingers.ring) return 'Y'

    // V & U (Distance based)
    if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb) {
      const indexMiddleDist = distance(landmarks[8], landmarks[12])
      if (indexMiddleDist > 0.1) return 'V'
      return 'U'
    }

    // S: Fist
    if (!fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky && !fingers.thumb) return 'S'

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
                Camera Active
              </>
            )}
          </div>

          {/* Hand zone indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-xs text-white/50">
            ✋ Show ASL gestures (A-Z, 1-10)
          </div>
        </>
      )}
    </div>
  )
}
