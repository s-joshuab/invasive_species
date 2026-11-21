import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CircleStop, Loader2, RefreshCw, VideoOff } from 'lucide-react'

export function CameraCapture({ onCapture }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const mountedRef = useRef(true)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    if (mountedRef.current) setStatus('idle')
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError('Camera access is not supported by this browser. Upload an image instead.')
      return
    }

    setStatus('starting')
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      })

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStatus('live')
    } catch (cameraError) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
      if (videoRef.current) videoRef.current.srcObject = null
      if (!mountedRef.current) return
      setStatus('error')
      if (cameraError.name === 'NotAllowedError') {
        setError('Camera permission was denied. Allow access or upload an image instead.')
      } else if (cameraError.name === 'NotFoundError') {
        setError('No camera found on this device. Upload an image instead.')
      } else {
        setError('Unable to start the camera. Upload an image instead.')
      }
    }
  }

  const captureFrame = () => {
    const video = videoRef.current
    if (!video || video.readyState < 2) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 960
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.86)
    stopCamera()
    onCapture(dataUrl)
  }

  const isLive = status === 'live'
  const isStarting = status === 'starting'

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#181818]">
      <div className="relative aspect-[4/3] min-h-[280px] w-full bg-[#171717]">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${isLive ? 'opacity-100' : 'opacity-0'}`}
          playsInline
          muted
          autoPlay
        />

        {isLive && (
          <>
            <div className="pointer-events-none absolute inset-4 border border-white/10">
              <span className="absolute -left-px -top-px h-5 w-5 border-l border-t border-brand/80" />
              <span className="absolute -right-px -top-px h-5 w-5 border-r border-t border-brand/80" />
              <span className="absolute -bottom-px -left-px h-5 w-5 border-b border-l border-brand/80" />
              <span className="absolute -bottom-px -right-px h-5 w-5 border-b border-r border-brand/80" />
            </div>
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-inv-high" />
              <span className="mono text-[8px] uppercase tracking-[0.12em] text-white/80">
                Live · Rear camera
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 bg-black/45 pb-4 pt-3">
              <button
                type="button"
                onClick={captureFrame}
                className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/30 bg-white text-[#111] transition-transform duration-150 active:scale-95"
                aria-label="Capture photo"
              >
                <Camera size={22} />
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/75 transition-colors hover:bg-black/70 hover:text-white"
                aria-label="Stop camera"
              >
                <CircleStop size={16} />
              </button>
            </div>
          </>
        )}

        {!isLive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            {isStarting ? (
              <>
                <Loader2 size={24} className="animate-spin text-brand" />
                <p className="mt-3 text-[12px] font-medium text-ink">Requesting camera access…</p>
                <p className="mt-1 text-[10.5px] text-subtle">Allow access when prompted by your browser.</p>
              </>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-panel text-muted">
                  {status === 'error' ? <VideoOff size={22} /> : <Camera size={22} />}
                </span>
                <p className="mt-3 text-[12px] font-medium text-ink">
                  {status === 'error' ? 'Camera unavailable' : 'Camera is off'}
                </p>
                <p className="mt-1 max-w-[280px] text-[10.5px] leading-4 text-subtle">
                  {error || 'Use the rear camera to capture a field specimen. Images stay on this device until synced.'}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="btn btn-primary mt-4"
                  disabled={isStarting}
                >
                  <Camera size={14} />
                  {status === 'error' ? 'Try camera again' : 'Start camera'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border bg-panel px-3 py-2">
        <p className="mono text-[9px] text-subtle">
          {isLive ? 'ENVIRONMENT · AUTO-FOCUS' : 'NO CAMERA STREAM ACTIVE'}
        </p>
        {isLive ? (
          <button type="button" onClick={stopCamera} className="btn btn-secondary btn-sm">
            <RefreshCw size={11} />
            Stop
          </button>
        ) : (
          <p className="text-[9px] text-subtle">Secure context required</p>
        )}
      </div>
    </div>
  )
}
