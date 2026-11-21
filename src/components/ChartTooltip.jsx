export function ChartTooltip({ active, payload, label, valueSuffix = '' }) {
  if (!active || !payload?.length) return null

  return (
    <div className="min-w-[140px] rounded-md border border-border bg-panel px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      {label && (
        <p className="mb-1.5 text-[10px] font-medium text-muted">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={`${entry.dataKey}-${entry.name}`}
            className="flex items-center gap-2 text-[10px]"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color || '#23855a' }}
            />
            <span className="text-subtle">{entry.name}</span>
            <span className="mono ml-auto pl-4 font-medium text-ink">
              {entry.value}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
