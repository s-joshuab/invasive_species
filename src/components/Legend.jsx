import { threatLevels } from '../data/mockScans'

const items = [threatLevels.high, threatLevels.moderate, threatLevels.low, threatLevels.native]

export function Legend({ className = '' }) {
  return (
    <div
      className={`pointer-events-auto rounded-lg border border-border bg-panel/95 p-3 font-sans shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-5">
        <p className="eyebrow">Invasion status</p>
        <span className="mono text-[8px] text-subtle">legend</span>
      </div>
      <div className="mt-2.5 space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 0 2px ${item.color}22`,
              }}
            />
            <span className="text-[10px] text-muted">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 border-t border-border pt-2">
        <span className="flex h-1 w-8 overflow-hidden rounded-full">
          <span className="h-full flex-1 bg-brand" />
          <span className="h-full flex-1 bg-inv-low" />
          <span className="h-full flex-1 bg-inv-mod" />
          <span className="h-full flex-1 bg-inv-high" />
        </span>
        <span className="text-[8.5px] text-subtle">weighted heat intensity</span>
      </div>
    </div>
  )
}
