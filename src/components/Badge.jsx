const variants = {
  invasive: 'border-inv-high/30 bg-inv-high/10 text-inv-high',
  native: 'border-native/30 bg-native/10 text-native',
  high: 'border-inv-high/30 bg-inv-high/10 text-inv-high',
  moderate: 'border-inv-mod/30 bg-inv-mod/10 text-inv-mod',
  low: 'border-inv-low/30 bg-inv-low/10 text-inv-low',
  brand: 'border-brand/30 bg-brand/10 text-brand',
  info: 'border-info/30 bg-info/10 text-info',
  reported: 'border-border bg-[#f0f0eb] text-muted',
  scheduled: 'border-info/30 bg-info/10 text-info',
  progress: 'border-inv-mod/30 bg-inv-mod/10 text-inv-mod',
  cleared: 'border-native/30 bg-native/10 text-native',
  neutral: 'border-border bg-[#f0f0eb] text-muted',
  danger: 'border-inv-high/30 bg-inv-high/10 text-inv-high',
  warning: 'border-inv-mod/30 bg-inv-mod/10 text-inv-mod',
  success: 'border-brand/30 bg-brand/10 text-brand',
}

const statusVariant = {
  Invasive: 'invasive',
  Native: 'native',
  Reported: 'reported',
  Scheduled: 'scheduled',
  'In Progress': 'progress',
  Cleared: 'cleared',
  Synced: 'success',
  'Pending sync': 'warning',
  'Pending scan': 'warning',
}

export function Badge({ variant = 'neutral', status, dot = false, children, className = '' }) {
  const resolvedVariant = status ? statusVariant[status] || variant : variant
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium leading-4 ${
        variants[resolvedVariant] || variants.neutral
      } ${className}`}
    >
      {dot && <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />}
      {children || status}
    </span>
  )
}
