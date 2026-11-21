import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Drawer({ open, onClose, title, eyebrow, description, children, footer }) {
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/55 animate-fade-in"
        aria-label="Close panel"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-border bg-panel shadow-[-24px_0_80px_rgba(0,0,0,0.4)] animate-slide-in"
      >
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow truncate">{eyebrow}</p>}
            <h2 id="drawer-title" className="truncate text-[13px] font-medium text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon -mr-1"
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>
        {description && (
          <div className="border-b border-border px-4 py-2.5">
            <p className="text-[11px] leading-4 text-muted">{description}</p>
          </div>
        )}
        <div className="scroll-area flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-3">
            {footer}
          </div>
        )}
      </aside>
    </div>,
    document.body,
  )
}
