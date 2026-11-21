import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Camera,
  CheckCircle2,
  CloudOff,
  Copy,
  Crosshair,
  Database,
  Image as ImageIcon,
  Leaf,
  Loader2,
  MapPin,
  RefreshCw,
  Save,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Upload,
  WifiOff,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/Badge'
import { CameraCapture } from '../components/CameraCapture'
import { UploadDropzone } from '../components/UploadDropzone'
import { useGeolocation, FALLBACK_LOCATION } from '../hooks/useGeolocation'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useScanStore } from '../hooks/useScanStore'
import { useToast } from '../components/Toast'
import { mockSpecies } from '../data/mockSpecies'
import { compressImage, fileToPreview } from '../lib/image'

const MODELS = [
  {
    id: 'mobilenet',
    label: 'MobileNetV2',
    type: 'CNN',
    description: 'Lightweight spatial feature extraction',
    latency: '~48 ms',
  },
  {
    id: 'yolov8',
    label: 'YOLOv8-Cls',
    type: 'Classification',
    description: 'Multi-scale detection & classification',
    latency: '~73 ms',
  },
]

function formatTimestamp(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function ScanStatusBadge({ scan }) {
  return (
    <Badge status={scan.syncStatus} dot>
      {scan.syncStatus}
    </Badge>
  )
}

export function Scanner() {
  const [inputMode, setInputMode] = useState('camera')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageSource, setImageSource] = useState(null)
  const [isProcessingImage, setIsProcessingImage] = useState(false)
  const [selectedModel, setSelectedModel] = useState('mobilenet')
  const [prediction, setPrediction] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedScanId, setSavedScanId] = useState(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const detectionTimerRef = useRef(null)

  const { showToast } = useToast()
  const isOnline = useOnlineStatus()
  const { scans, loading, pendingCount, saveScan, syncPending } = useScanStore()
  const {
    coords,
    status: locationStatus,
    error: locationError,
    locate,
    reset: resetLocation,
    isLocating,
    isFallback,
  } = useGeolocation()

  const activeModel = MODELS.find((model) => model.id === selectedModel) || MODELS[0]

  const recentScans = useMemo(
    () =>
      [...scans].sort(
        (left, right) => new Date(right.savedAt || 0) - new Date(left.savedAt || 0),
      ),
    [scans],
  )

  useEffect(
    () => () => {
      if (detectionTimerRef.current) window.clearTimeout(detectionTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (imagePreview) {
      locate()
    }
  }, [imagePreview, locate])

  const resetPrediction = () => {
    if (detectionTimerRef.current) {
      window.clearTimeout(detectionTimerRef.current)
      detectionTimerRef.current = null
    }
    setPrediction(null)
    setSavedScanId(null)
    setIsPredicting(false)
  }

  const applyImage = async (rawImage, source) => {
    setIsProcessingImage(true)
    resetPrediction()
    try {
      const preview = await compressImage(rawImage, 1200, 0.8)
      setImagePreview(preview)
      setImageSource(source)
    } catch {
      showToast({
        type: 'error',
        title: 'Image could not be processed',
        description: 'Try a different photo or file format.',
      })
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handleUpload = async (file) => {
    setIsProcessingImage(true)
    resetPrediction()
    try {
      const preview = await fileToPreview(file, 1200)
      setImagePreview(preview)
      setImageSource('upload')
    } catch {
      showToast({
        type: 'error',
        title: 'Unable to read image',
        description: 'The selected file could not be loaded. Try another photo.',
      })
    } finally {
      setIsProcessingImage(false)
    }
  }

  const handleClearImage = () => {
    setImagePreview(null)
    setImageSource(null)
    setInputMode('camera')
    resetPrediction()
    resetLocation()
  }

  const handleModelChange = (modelId) => {
    if (isPredicting) return
    setSelectedModel(modelId)
    resetPrediction()
  }

  const runDetection = () => {
    if (!imagePreview || isPredicting) return

    resetPrediction()
    setIsPredicting(true)

    detectionTimerRef.current = window.setTimeout(() => {
      const species = mockSpecies[Math.floor(Math.random() * mockSpecies.length)]
      const confidence = Number((87 + Math.random() * 11.7).toFixed(1))
      const inferenceMs = Math.round(120 + Math.random() * 95)
      const activeCoords = coords || FALLBACK_LOCATION

      const response = {
        status: 'success',
        request_id: `INF-${Date.now().toString(36).toUpperCase()}`,
        model: activeModel.label,
        inference_ms: inferenceMs,
        prediction: {
          common_name: species.commonName,
          scientific_name: species.scientificName,
          confidence: Number((confidence / 100).toFixed(4)),
          ecological_status: species.status,
        },
        geotag: {
          lat: activeCoords.lat,
          lng: activeCoords.lng,
          source: activeCoords.source === 'gps' ? 'HTML5 GPS' : 'demo-fallback',
        },
        offline_mode: !navigator.onLine,
        mocked: true,
      }

      setPrediction({
        ...response,
        species,
        confidence,
        modelId: activeModel.id,
      })
      setIsPredicting(false)
      detectionTimerRef.current = null
    }, 1500)
  }

  const handleSaveScan = async () => {
    if (!prediction || !imagePreview || isSaving || savedScanId) return

    setIsSaving(true)
    try {
      const thumbnail = await compressImage(imagePreview, 360, 0.68)
      const activeCoords = coords || FALLBACK_LOCATION

      const record = await saveScan({
        species: prediction.species.commonName,
        scientificName: prediction.species.scientificName,
        status: prediction.species.status,
        confidence: prediction.confidence,
        lat: activeCoords.lat,
        lng: activeCoords.lng,
        locationSource:
          activeCoords.source === 'gps' ? 'HTML5 GPS' : 'Demo fallback coordinate',
        province: 'Ilocos Region',
        model: activeModel.label,
        thumbnail,
        observedAt: new Date().toISOString(),
      })

      setSavedScanId(record.id)
      showToast({
        type: navigator.onLine ? 'success' : 'warning',
        title: navigator.onLine ? 'Scan saved to field log' : 'Scan saved offline',
        description: navigator.onLine
          ? `${record.id} is available in this browser and marked synced.`
          : `${record.id} is queued in IndexedDB as Pending sync.`,
      })
    } catch {
      showToast({
        type: 'error',
        title: 'Unable to save scan',
        description: 'Check available browser storage and try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSyncNow = async () => {
    if (!isOnline) {
      showToast({
        type: 'warning',
        title: 'You are still offline',
        description: 'Pending scans will sync once connectivity returns.',
      })
      return
    }

    setIsSyncing(true)
    const count = await syncPending()
    setIsSyncing(false)
    showToast({
      type: count > 0 ? 'success' : 'info',
      title: count > 0 ? `${count} scan${count > 1 ? 's' : ''} synced` : 'Field log is up to date',
      description:
        count > 0
          ? 'Pending local scans have been marked as synced (mock backend).'
          : 'No pending scans remain on this device.',
    })
  }

  const copyResponse = async () => {
    if (!prediction) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(prediction, null, 2))
      showToast({ type: 'success', title: 'API response copied' })
    } catch {
      showToast({ type: 'warning', title: 'Clipboard unavailable', description: 'Select the JSON to copy it manually.' })
    }
  }

  const coordsForDisplay = coords || FALLBACK_LOCATION

  return (
    <div className="mx-auto w-full max-w-content p-4 sm:p-6">
      <PageHeader
        title="AI Scanner"
        description="Capture or upload a plant specimen, auto-geotag it from the field, and run a simulated on-device classification."
      >
        <div className="hidden items-center gap-2 sm:flex">
          <Badge variant={isOnline ? 'brand' : 'warning'} dot>
            {isOnline ? 'Sync available' : 'Offline mode'}
          </Badge>
          <Badge variant="neutral" className="mono">
            {pendingCount} pending
          </Badge>
        </div>
      </PageHeader>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <section className="panel min-w-0 overflow-hidden">
          <div className="card-header">
            <div>
              <h2 className="card-title">Field specimen image</h2>
              <p className="card-description">Rear camera or gallery upload · images stay on-device.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-subtle">
              <ShieldAlert size={11} className="text-brand" />
              Auto-geotag
            </div>
          </div>

          <div className="p-3 sm:p-4">
            {!imagePreview ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('camera')}
                    className={`flex items-center gap-2.5 rounded-md border p-2.5 text-left transition-colors duration-150 ${
                      inputMode === 'camera'
                        ? 'border-brand/40 bg-brand/[0.07]'
                        : 'border-border bg-app hover:bg-hover'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                        inputMode === 'camera'
                          ? 'border-brand/25 bg-brand/10 text-brand'
                          : 'border-border bg-app text-muted'
                      }`}
                    >
                      <Camera size={15} />
                    </span>
                    <span>
                      <span className="block text-[11.5px] font-medium text-ink">Use Camera</span>
                      <span className="block text-[9.5px] text-subtle">Live field capture</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`flex items-center gap-2.5 rounded-md border p-2.5 text-left transition-colors duration-150 ${
                      inputMode === 'upload'
                        ? 'border-brand/40 bg-brand/[0.07]'
                        : 'border-border bg-app hover:bg-hover'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
                        inputMode === 'upload'
                          ? 'border-brand/25 bg-brand/10 text-brand'
                          : 'border-border bg-app text-muted'
                      }`}
                    >
                      <Upload size={15} />
                    </span>
                    <span>
                      <span className="block text-[11.5px] font-medium text-ink">Upload Image</span>
                      <span className="block text-[9.5px] text-subtle">From this device</span>
                    </span>
                  </button>
                </div>

                <div className="mt-3">
                  {inputMode === 'camera' ? (
                    <CameraCapture
                      onCapture={(rawImage) => applyImage(rawImage, 'camera')}
                    />
                  ) : (
                    <UploadDropzone onFile={handleUpload} disabled={isProcessingImage} />
                  )}
                </div>
              </>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border bg-[#181818]">
                <div className="relative aspect-[4/3] max-h-[380px] w-full">
                  <img
                    src={imagePreview}
                    alt="Field specimen selected for classification"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[8.5px] font-medium text-white/85 backdrop-blur-sm">
                      {imageSource === 'camera' ? <Camera size={10} /> : <ImageIcon size={10} />}
                      {imageSource === 'camera' ? 'Captured image' : 'Uploaded image'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md border border-white/15 bg-black/60 px-2 py-1.5 text-[9px] font-medium text-white/85 backdrop-blur-sm transition-colors hover:bg-black/80"
                  >
                    <RefreshCw size={10} />
                    Retake
                  </button>
                  {isProcessingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <Loader2 size={22} className="animate-spin text-brand" />
                    </div>
                  )}
                </div>

                <div className="border-t border-border bg-panel p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin size={14} className="mt-0.5 shrink-0 text-muted" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium text-muted">Auto-geotag</p>
                        {isLocating ? (
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="skeleton block h-3 w-36" />
                            <span className="text-[9px] text-subtle">Locating…</span>
                          </div>
                        ) : (
                          <p className="mono mt-1 truncate text-[10.5px] text-ink">
                            {coordsForDisplay.lat.toFixed(6)}, {coordsForDisplay.lng.toFixed(6)}
                          </p>
                        )}
                        {!isLocating && locationStatus !== 'idle' && (
                          <p className="mt-1 text-[9px] text-subtle">
                            {isFallback
                              ? 'Demo fallback · Laoag City, Ilocos Norte'
                              : `GPS accuracy ±${coordsForDisplay.accuracy || 0} m`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Badge variant={isFallback ? 'warning' : 'brand'}>
                        {isLocating ? 'Locating' : isFallback ? 'Fallback' : 'GPS'}
                      </Badge>
                      <button
                        type="button"
                        onClick={locate}
                        className="btn-icon h-7 w-7"
                        title="Refresh geolocation"
                        aria-label="Refresh geolocation"
                      >
                        {isLocating ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Crosshair size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                  {locationError && (
                    <p className="mt-2 rounded-md border border-inv-mod/20 bg-inv-mod/[0.06] px-2 py-1.5 text-[9px] leading-4 text-inv-mod">
                      {locationError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isProcessingImage && !imagePreview && (
              <div className="mt-3 flex items-center gap-2 text-[10px] text-muted">
                <Loader2 size={12} className="animate-spin text-brand" />
                Preparing image for model input…
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-px border-t border-border bg-border text-center">
            <div className="bg-panel px-2 py-2.5">
              <p className="mono text-[10px] text-ink">224×224</p>
              <p className="mt-0.5 text-[8.5px] text-subtle">Model input</p>
            </div>
            <div className="bg-panel px-2 py-2.5">
              <p className="mono text-[10px] text-ink">HTML5 GPS</p>
              <p className="mt-0.5 text-[8.5px] text-subtle">Geotag source</p>
            </div>
            <div className="bg-panel px-2 py-2.5">
              <p className="mono text-[10px] text-ink">IndexedDB</p>
              <p className="mt-0.5 text-[8.5px] text-subtle">Local storage</p>
            </div>
          </div>
        </section>

        <section className="panel flex min-w-0 flex-col overflow-hidden">
          <div className="flex items-center border-b border-border px-2">
            {MODELS.map((model) => {
              const active = selectedModel === model.id
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleModelChange(model.id)}
                  disabled={isPredicting}
                  className={`relative flex flex-1 flex-col items-center px-2 py-2.5 transition-colors duration-150 disabled:cursor-not-allowed sm:items-start sm:px-3 ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-medium">
                    {model.label}
                    <span className="text-[8px] font-normal uppercase tracking-wide text-subtle">
                      {model.type}
                    </span>
                  </span>
                  <span className="mt-0.5 text-[8.5px] text-subtle">{model.latency}</span>
                  {active && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand sm:inset-x-3" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="card-title">Detection result</h2>
                <p className="card-description">{activeModel.description}</p>
              </div>
              <span className="flex h-7 w-7 items-center justify-center rounded border border-border bg-app text-muted">
                <Sparkles size={13} />
              </span>
            </div>

            {!imagePreview && !isPredicting && (
              <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-app text-subtle">
                  <ScanLine size={22} />
                </span>
                <p className="mt-3 text-[12px] font-medium text-ink">Ready to classify</p>
                <p className="mt-1 max-w-[250px] text-[10.5px] leading-4 text-subtle">
                  Add a field image. The selected model will return a mocked species
                  prediction and confidence score.
                </p>
              </div>
            )}

            {isPredicting && (
              <div className="flex flex-1 flex-col justify-center py-8" aria-live="polite">
                <div className="mx-auto flex w-full max-w-[300px] flex-col items-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-brand/25 bg-brand/[0.06]">
                    <Loader2 size={26} className="animate-spin text-brand" />
                    <span className="absolute inset-2 rounded-full border border-dashed border-brand/20" />
                  </div>
                  <p className="mt-4 text-[12px] font-medium text-ink">
                    Running {activeModel.label} inference
                  </p>
                  <p className="mt-1 text-[9.5px] text-subtle">
                    Normalizing image · extracting spatial features
                  </p>
                  <div className="mt-4 w-full space-y-2">
                    <div className="skeleton h-2 w-full" />
                    <div className="skeleton h-2 w-3/4" />
                    <div className="skeleton h-2 w-1/2" />
                  </div>
                </div>
              </div>
            )}

            {prediction && !isPredicting && (
              <div className="mt-4 flex-1" aria-live="polite">
                <div className="rounded-lg border border-border bg-app p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
                          prediction.species.status === 'Invasive'
                            ? 'border-inv-high/20 bg-inv-high/[0.07] text-inv-high'
                            : 'border-native/20 bg-native/[0.07] text-native'
                        }`}
                      >
                        <Leaf size={18} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium leading-5 text-ink">
                          {prediction.species.commonName}
                        </p>
                        <p className="mono truncate text-[9.5px] italic text-muted">
                          {prediction.species.scientificName}
                        </p>
                      </div>
                    </div>
                    <Badge status={prediction.species.status} dot>
                      {prediction.species.status}
                    </Badge>
                  </div>

                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[9.5px]">
                      <span className="text-subtle">Model confidence</span>
                      <span className="mono font-medium text-brand">
                        {prediction.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#e4e4de]">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[9px] text-subtle">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={10} className="text-brand" />
                        Inference typical
                      </span>
                      <span className="mono">{prediction.inference_ms} ms</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-lg border border-border bg-app">
                  <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
                    <span className="mono text-[8.5px] text-subtle">API RESPONSE · JSON</span>
                    <button
                      type="button"
                      onClick={copyResponse}
                      className="flex items-center gap-1 text-[8.5px] text-subtle transition-colors hover:text-ink"
                    >
                      <Copy size={10} />
                      Copy
                    </button>
                  </div>
                  <pre className="mono max-h-[190px] overflow-auto p-2.5 text-[9px] leading-[1.65] text-muted">
{JSON.stringify(
  {
    status: prediction.status,
    request_id: prediction.request_id,
    model: prediction.model,
    inference_ms: prediction.inference_ms,
    prediction: prediction.prediction,
    geotag: prediction.geotag,
    offline_mode: prediction.offline_mode,
  },
  null,
  2,
)}
                  </pre>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveScan}
                    disabled={isSaving || Boolean(savedScanId)}
                    className="btn btn-primary flex-1"
                  >
                    {isSaving ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : savedScanId ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <Save size={13} />
                    )}
                    {isSaving ? 'Saving…' : savedScanId ? 'Saved to field log' : 'Save Scan'}
                  </button>
                  <button
                    type="button"
                    onClick={runDetection}
                    disabled={isSaving}
                    className="btn btn-secondary px-2.5"
                    title="Run detection again"
                    aria-label="Run detection again"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
                {!isOnline && (
                  <p className="mt-2 flex items-center justify-center gap-1 text-[9px] text-inv-mod">
                    <WifiOff size={10} />
                    Offline · scan will be queued as Pending sync
                  </p>
                )}
              </div>
            )}

            {!prediction && !isPredicting && (
              <div className="mt-4 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={runDetection}
                  disabled={!imagePreview || isProcessingImage}
                  className="btn btn-primary w-full"
                >
                  <ScanLine size={14} />
                  Run Detection
                </button>
                {!imagePreview && (
                  <p className="mt-2 text-center text-[9px] text-subtle">
                    Add a specimen image to enable detection.
                  </p>
                )}
                {imagePreview && (
                  <p className="mt-2 text-center text-[9px] text-subtle">
                    Simulated inference · {activeModel.label}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="panel mt-4 overflow-hidden">
        <div className="card-header flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-app text-muted">
              <Database size={13} />
            </div>
            <div>
              <h2 className="card-title">Recent field scans</h2>
              <p className="card-description">
                Saved locally in IndexedDB · {scans.length} total scan{scans.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            {pendingCount > 0 && (
              <Badge variant="warning" dot>
                {pendingCount} pending sync
              </Badge>
            )}
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing || pendingCount === 0 || !isOnline}
              className="btn btn-secondary btn-sm"
            >
              {isSyncing ? (
                <Loader2 size={11} className="animate-spin" />
              ) : isOnline ? (
                <RefreshCw size={11} />
              ) : (
                <CloudOff size={11} />
              )}
              Sync now
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2 p-3">
            {[0, 1].map((index) => (
              <div key={index} className="flex items-center gap-3 rounded-md border border-border p-2.5">
                <div className="skeleton h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-2.5 w-32" />
                  <div className="skeleton h-2 w-48" />
                </div>
                <div className="skeleton h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentScans.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-app text-subtle">
              <CloudOff size={18} />
            </span>
            <p className="mt-2.5 text-[11.5px] font-medium text-ink">No field scans saved yet</p>
            <p className="mt-1 max-w-sm text-[10px] leading-4 text-subtle">
              Classify a specimen, then save it to keep a geotagged record on this device.
              Offline records appear here as Pending sync.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                className="flex flex-wrap items-center gap-3 px-3 py-2.5 transition-colors duration-150 hover:bg-hover/60 sm:flex-nowrap"
              >
                {scan.thumbnail ? (
                  <img
                    src={scan.thumbnail}
                    alt={`${scan.species} field scan thumbnail`}
                    className="h-10 w-10 shrink-0 rounded-md border border-border object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-app text-subtle">
                    <Leaf size={16} />
                  </div>
                )}
                <div className="min-w-0 flex-[1.5]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-[11.5px] font-medium text-ink">{scan.species}</p>
                    <Badge status={scan.status}>{scan.status}</Badge>
                  </div>
                  <p className="mono truncate text-[9px] italic text-subtle">
                    {scan.scientificName}
                  </p>
                </div>
                <div className="min-w-[120px]">
                  <p className="mono text-[9.5px] text-muted">
                    {Number(scan.lat).toFixed(4)}, {Number(scan.lng).toFixed(4)}
                  </p>
                  <p className="mono mt-0.5 text-[8.5px] text-subtle">
                    {formatTimestamp(scan.observedAt)} · {scan.model}
                  </p>
                </div>
                <div className="mono hidden text-right text-[9px] text-brand sm:block">
                  {Number(scan.confidence).toFixed(1)}%
                </div>
                <div className="ml-auto shrink-0 sm:ml-0 sm:w-[104px] sm:text-right">
                  <ScanStatusBadge scan={scan} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-app px-3 py-2">
          <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-brand' : 'bg-inv-mod'}`} />
          <span className="text-[9px] text-subtle">
            {isOnline
              ? 'Connected — synced scans mirror to the mock DENR database.'
              : 'Offline — new scans stay in IndexedDB until connectivity returns.'}
          </span>
          <LinkHint count={pendingCount} />
        </div>
      </section>
    </div>
  )
}

function LinkHint({ count }) {
  if (!count) return null
  return (
    <span className="mono ml-auto rounded border border-border bg-app px-1.5 py-0.5 text-[8.5px] text-subtle">
      QUEUE · {count}
    </span>
  )
}
