const tones = {
  default: {
    iconBox: 'border-border bg-app text-muted',
    bar: 'bg-[#a3a39b]',
    value: 'text-ink',
  },
  danger: {
    iconBox: 'border-inv-high/20 bg-inv-high/10 text-inv-high',
    bar: 'bg-inv-high',
    value: 'text-inv-high',
  },
  warning: {
    iconBox: 'border-inv-mod/20 bg-inv-mod/10 text-inv-mod',
    bar: 'bg-inv-mod',
    value: 'text-inv-mod',
  },
  success: {
    iconBox: 'border-brand/20 bg-brand/10 text-brand',
    bar: 'bg-brand',
    value: 'text-brand',
  },
}

export function StatCard({
  label,
  value,
  suffix,
  helper,
  icon: Icon,
  tone = 'default',
  progress = 55,
}) {
  const styles = tones[tone] || tones.default

  return (
    <div className="panel p-4 transition-colors duration-150 hover:border-[#c9c9c1]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`mono text-[24px] font-medium leading-none ${styles.value}`}>
              {value}
            </span>
            {suffix && <span className="text-[11px] text-subtle">{suffix}</span>}
          </div>
        </div>
        {Icon && (
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${styles.iconBox}`}
          >
            <Icon size={15} />
          </div>
        )}
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#ecece6]">
        <div
          className={`h-full rounded-full ${styles.bar} transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {helper && <p className="mt-2 truncate text-[10.5px] text-subtle">{helper}</p>}
    </div>
  )
}
