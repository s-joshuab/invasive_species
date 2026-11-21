import { useOnlineStatus } from '../hooks/useOnlineStatus'
import { useScanStore } from '../hooks/useScanStore'

export function OfflineIndicator({ compact = false }) {
  const isOnline = useOnlineStatus()
  const { pendingCount } = useScanStore()

  return (
    <div
      className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-medium ${
        isOnline
          ? 'border-brand/25 bg-brand/[0.07] text-brand'
          : 'border-inv-mod/30 bg-inv-mod/10 text-inv-mod'
      }`}
      title={
        isOnline
          ? 'Connected to the internet'
          : 'Offline — scans will be stored on this device'
      }
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          isOnline ? 'bg-brand' : 'bg-inv-mod'
        }`}
        aria-hidden="true"
      />
      {!compact && <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>}
      <span className="hidden h-3 w-px bg-current opacity-20 sm:block" aria-hidden="true" />
      <span className="mono whitespace-nowrap text-[9.5px]">
        Pending sync: {pendingCount}
      </span>
    </div>
  )
}
