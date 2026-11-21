import { Layers3, ShieldCheck } from 'lucide-react'
import { Badge } from './Badge'
import { threatLevels } from '../data/mockScans'

function LayerThumbnail({ id, active }) {
  const border = active ? 'border-brand/60' : 'border-border'
  const common = `relative h-9 w-11 shrink-0 overflow-hidden rounded border bg-[#f1f1eb] ${border}`

  if (id === 'boundaries') {
    return (
      <span className={common} aria-hidden="true">
        <svg viewBox="0 0 44 36" className="h-full w-full">
          <path
            d="M4 28 11 8l11 7 10-9 8 13-12 9-8-5-9 8Z"
            fill="rgba(35,133,90,0.08)"
            stroke="#23855a"
            strokeOpacity=".6"
            strokeWidth="1"
          />
          <path d="M15 12v14M26 10v16" stroke="#23855a" strokeOpacity=".28" strokeDasharray="2 2" />
        </svg>
      </span>
    )
  }

  if (id === 'heatmap') {
    return (
      <span className={common} aria-hidden="true">
        <span className="absolute left-2 top-4 h-4 w-4 rounded-full bg-inv-high/60 blur-[2px]" />
        <span className="absolute left-6 top-3 h-3 w-3 rounded-full bg-inv-high/50 blur-[1px]" />
        <span className="absolute left-5 top-5 h-4 w-4 rounded-full bg-inv-mod/50 blur-[2px]" />
        <span className="absolute left-8 top-4 h-2 w-2 rounded-full bg-inv-low/60" />
        <span className="absolute left-1 top-2 h-2 w-2 rounded-full bg-native/50" />
      </span>
    )
  }

  if (id === 'protected') {
    return (
      <span className={common} aria-hidden="true">
        <svg viewBox="0 0 44 36" className="h-full w-full">
          <path
            d="M8 25c1-8 5-14 14-16 6 3 10 8 13 15-5 5-9 7-15 7-5 0-8-2-12-6Z"
            fill="rgba(35,133,90,0.12)"
            stroke="#23855a"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <path d="M18 21c1-5 4-8 8-10" stroke="#23855a" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    )
  }

  if (id === 'buffers') {
    return (
      <span className={common} aria-hidden="true">
        <svg viewBox="0 0 44 36" className="h-full w-full">
          <path d="M3 30c8-3 12-12 19-13 7-1 10-6 19-11" stroke="#1d4ed8" strokeWidth="5" strokeOpacity=".15" fill="none" />
          <path d="M3 30c8-3 12-12 19-13 7-1 10-6 19-11" stroke="#1d4ed8" strokeWidth="1.2" fill="none" />
          <path d="M3 8c11 2 13 8 19 13s9 7 19 5" stroke="#b85c08" strokeWidth="4" strokeOpacity=".12" fill="none" />
          <path d="M3 8c11 2 13 8 19 13s9 7 19 5" stroke="#b85c08" strokeWidth="1" fill="none" />
        </svg>
      </span>
    )
  }

  if (id === 'elevation') {
    return (
      <span className={common} aria-hidden="true">
        <svg viewBox="0 0 44 36" className="h-full w-full">
          <path d="M1 30c7-2 9-12 16-13s8 6 13 5 7-7 13-9" stroke="#a3a3a3" strokeOpacity=".25" fill="none" />
          <path d="M1 26c7-2 10-9 16-10s9 5 13 4 7-5 13-7" stroke="#a3a3a3" strokeOpacity=".4" fill="none" />
          <path d="M2 21c5-2 9-7 15-7s9 4 13 3 7-3 12-5" stroke="#a3a3a3" strokeOpacity=".65" fill="none" />
          <path d="m27 7 4 7 4-7Z" fill="#a3a3a3" fillOpacity=".5" />
        </svg>
      </span>
    )
  }

  return (
    <span className={common} aria-hidden="true">
      <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-inv-high/70" />
      <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-inv-mod/70" />
      <span className="absolute bottom-2 left-3 h-2 w-2 rounded-full bg-brand/70" />
      <span className="absolute bottom-2.5 right-2.5 h-2 w-2 rounded-full bg-info/70" />
      <svg viewBox="0 0 44 36" className="absolute inset-0 h-full w-full">
        <path d="M8 12c8 2 9 8 14 12s8 3 14 1" stroke="#525252" strokeWidth=".8" strokeDasharray="2 2" fill="none" />
      </svg>
    </span>
  )
}

export function LayerPanel({
  layers,
  activeLayers,
  onToggle,
  heatOpacity,
  onHeatOpacityChange,
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  bufferMeters,
  onBufferChange,
  bufferStats,
  className = '',
}) {
  const selectedHotspot = hotspots.find((spot) => spot.id === selectedHotspotId)
  const activeCount = Object.values(activeLayers).filter(Boolean).length
  const threat = selectedHotspot ? threatLevels[selectedHotspot.severity] : null

  return (
    <div className={`flex flex-col border-border bg-panel ${className}`}>
      <div className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-4 py-3.5">
        <div>
          <div className="flex items-center gap-2">
            <Layers3 size={14} className="text-muted" />
            <h2 className="text-[12.5px] font-medium text-ink">GIS Spatial Layers</h2>
          </div>
          <p className="mt-1 text-[10px] text-subtle">Toggle overlays and run a buffer analysis.</p>
        </div>
        <Badge variant="neutral" className="mono">
          {activeCount}/6
        </Badge>
      </div>

      <div className="scroll-area min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1.5 p-3">
          {layers.map((layer) => {
            const active = Boolean(activeLayers[layer.id])
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => onToggle(layer.id)}
                aria-pressed={active}
                className={`flex w-full items-center gap-2.5 rounded-md border p-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 ${
                  active
                    ? 'border-brand/25 bg-brand/[0.045]'
                    : 'border-border bg-app hover:bg-hover'
                }`}
              >
                <LayerThumbnail id={layer.id} active={active} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-medium leading-4 text-ink">
                    {layer.label}
                  </span>
                  <span className="block truncate text-[9px] text-subtle">{layer.detail}</span>
                </span>
                <span
                  className="switch"
                  data-checked={active ? 'true' : 'false'}
                  aria-hidden="true"
                >
                  <span className="switch-thumb" />
                </span>
              </button>
            )
          })}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <label htmlFor="heat-opacity" className="text-[10.5px] font-medium text-muted">
              Heatmap opacity
            </label>
            <span className="mono text-[10px] text-brand">{Math.round(heatOpacity * 100)}%</span>
          </div>
          <input
            id="heat-opacity"
            type="range"
            min="20"
            max="100"
            step="5"
            value={heatOpacity * 100}
            onChange={(event) => onHeatOpacityChange(Number(event.target.value) / 100)}
            className="range-brand mt-2.5"
          />
          <div className="mt-1 flex justify-between text-[8.5px] text-subtle">
            <span>Subtle</span>
            <span>Intense</span>
          </div>
        </div>

        <div className="border-t border-border p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="eyebrow">Buffer analysis</p>
              <p className="mt-1 text-[9.5px] text-subtle">Select a hotspot to model impact radius.</p>
            </div>
            <ShieldCheck size={14} className="shrink-0 text-subtle" />
          </div>

          <label htmlFor="buffer-hotspot" className="label mt-3">
            Selected hotspot
          </label>
          <select
            id="buffer-hotspot"
            className="select"
            value={selectedHotspotId}
            onChange={(event) => onSelectHotspot(event.target.value)}
          >
            {hotspots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.id} · {spot.name}
              </option>
            ))}
          </select>

          {selectedHotspot && (
            <div className="mt-2.5 flex items-center justify-between rounded-md border border-border bg-app px-2.5 py-2">
              <div className="min-w-0">
                <p className="truncate text-[10.5px] font-medium text-ink">
                  {selectedHotspot.municipality}, {selectedHotspot.province}
                </p>
                <p className="mono mt-0.5 text-[9px] text-subtle">
                  {selectedHotspot.lat.toFixed(4)}, {selectedHotspot.lng.toFixed(4)}
                </p>
              </div>
              <Badge variant={selectedHotspot.severity}>{threat?.shortLabel}</Badge>
            </div>
          )}

          <div className="mt-3.5">
            <div className="flex items-center justify-between">
              <label htmlFor="buffer-radius" className="text-[10.5px] font-medium text-muted">
                Buffer radius
              </label>
              <span className="mono rounded border border-border bg-app px-1.5 py-0.5 text-[9.5px] text-brand">
                {bufferMeters >= 1000
                  ? `${(bufferMeters / 1000).toFixed(bufferMeters % 1000 === 0 ? 0 : 1)} km`
                  : `${bufferMeters} m`}
              </span>
            </div>
            <input
              id="buffer-radius"
              type="range"
              min="100"
              max="2000"
              step="100"
              value={bufferMeters}
              onChange={(event) => onBufferChange(Number(event.target.value))}
              className="range-brand mt-2.5"
            />
            <div className="mt-1 flex justify-between text-[8.5px] text-subtle">
              <span>100 m</span>
              <span>2 km</span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-app p-2.5">
              <p className="text-[9px] text-subtle">Affected area</p>
              <p className="mono mt-1 text-[16px] font-medium leading-none text-ink">
                {bufferStats.affectedHa}
                <span className="ml-1 text-[9px] font-normal text-subtle">ha</span>
              </p>
            </div>
            <div className="rounded-md border border-border bg-app p-2.5">
              <p className="text-[9px] text-subtle">Protected zone</p>
              <p
                className={`mt-1 text-[13px] font-medium leading-none ${
                  bufferStats.nearbyProtected ? 'text-inv-high' : 'text-brand'
                }`}
              >
                {bufferStats.nearbyProtected ? 'Yes' : 'No'}
              </p>
              <p className="mt-1 text-[8px] text-subtle">
                {bufferStats.nearbyProtected ? 'Within 2 km' : 'No overlap detected'}
              </p>
            </div>
          </div>

          <p className="mt-2 text-[8.5px] leading-4 text-subtle">
            Euclidean buffer approximation for planning only. Field validation is required.
          </p>
        </div>
      </div>
    </div>
  )
}
