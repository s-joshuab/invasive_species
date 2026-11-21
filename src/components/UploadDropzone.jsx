import { useRef, useState } from 'react'
import { ImagePlus, UploadCloud } from 'lucide-react'

export function UploadDropzone({ onFile, disabled = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select a JPG, PNG, or WebP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Choose a file under 10 MB.')
      return
    }
    setError(null)
    onFile(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    handleFile(event.dataTransfer.files?.[0])
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          handleFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex min-h-[300px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-5 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50 ${
          dragging
            ? 'border-brand bg-brand/[0.06]'
            : 'border-[#3a3a3a] bg-app hover:border-brand/50 hover:bg-[#212121]'
        }`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
            dragging
              ? 'border-brand/30 bg-brand/10 text-brand'
              : 'border-border bg-panel text-muted'
          }`}
        >
          {dragging ? <ImagePlus size={22} /> : <UploadCloud size={22} />}
        </span>
        <span>
          <span className="block text-[13px] font-medium text-ink">
            {dragging ? 'Drop image to classify' : 'Drop a plant image here'}
          </span>
          <span className="mt-1 block text-[11px] text-subtle">
            or click to browse your device
          </span>
        </span>
        <span className="mono rounded-full border border-border bg-app px-2 py-1 text-[9px] text-subtle">
          JPG · PNG · WEBP · MAX 10 MB
        </span>
      </button>
      {error && <p className="mt-2 text-[11px] text-inv-high">{error}</p>}
    </div>
  )
}
