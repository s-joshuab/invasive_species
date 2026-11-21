import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const toneStyles = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-brand',
    border: 'border-brand/25',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-inv-mod',
    border: 'border-inv-mod/25',
  },
  error: {
    icon: AlertTriangle,
    iconClass: 'text-inv-high',
    border: 'border-inv-high/25',
  },
  info: {
    icon: Info,
    iconClass: 'text-info',
    border: 'border-border',
  },
}

function ToastItem({ toast, onDismiss }) {
  const tone = toneStyles[toast.type] || toneStyles.info
  const Icon = tone.icon
  const timerRef = useRef(null)

  useEffect(() => {
    if (!toast.duration) return undefined
    timerRef.current = window.setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timerRef.current)
  }, [toast.duration, toast.id, onDismiss])

  const handleAction = () => {
    toast.action?.onClick?.()
    onDismiss(toast.id)
  }

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-[min(360px,calc(100vw-24px))] items-start gap-3 rounded-lg border bg-panel p-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)] ${tone.border} animate-toast-in`}
    >
      <Icon size={16} className={`mt-0.5 shrink-0 ${tone.iconClass}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-ink">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-[11px] leading-4 text-muted">{toast.description}</p>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={handleAction}
            className="mt-2 inline-flex h-7 items-center rounded border border-brand/30 bg-brand/10 px-2.5 text-[11px] font-medium text-brand transition-colors hover:bg-brand/15"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-subtle transition-colors hover:bg-hover hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((options) => {
    counterRef.current += 1
    const id = `toast-${Date.now()}-${counterRef.current}`
    const toast = {
      id,
      type: 'info',
      duration: 4500,
      ...options,
    }
    setToasts((current) => [...current.slice(-2), toast])
    return id
  }, [])

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-3 z-[120] flex flex-col items-end gap-2 sm:bottom-5 sm:right-5">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
