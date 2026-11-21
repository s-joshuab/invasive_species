import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'
import { PAGE_LABELS } from '../config/navigation'
import { OfflineIndicator } from './OfflineIndicator'

export function Topbar({ onOpenSearch, onOpenMobileMenu }) {
  const location = useLocation()
  const pageLabel = PAGE_LABELS[location.pathname] || 'Dashboard'

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-app px-3 sm:px-4">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        className="btn-icon -ml-1 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={17} />
      </button>

      <div className="flex min-w-0 items-center gap-1.5 text-[11.5px]">
        <Link
          to="/"
          className="hidden shrink-0 text-subtle transition-colors hover:text-muted sm:inline"
        >
          Region 1
        </Link>
        <span className="hidden text-subtle/50 sm:inline">/</span>
        <span className="truncate font-medium text-ink">{pageLabel}</span>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden h-8 w-[224px] items-center gap-2 rounded-md border border-border bg-panel px-2.5 text-left text-[11px] text-subtle transition-colors duration-150 hover:border-[#c9c9c1] hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 md:flex"
          aria-label="Open command palette"
        >
          <Search size={13} className="shrink-0" />
          <span className="truncate">Search species, pages…</span>
          <kbd className="mono ml-auto shrink-0 rounded border border-border bg-app px-1.5 py-0.5 text-[9px] leading-3 text-muted">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          className="btn-icon md:hidden"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        <OfflineIndicator />

        <button
          type="button"
          className="btn-icon relative hidden sm:inline-flex"
          aria-label="Notifications"
          title="3 unread field alerts"
        >
          <Bell size={16} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-app bg-inv-mod" />
        </button>

        <button
          type="button"
          className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] font-semibold text-brand transition-colors hover:bg-brand/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          aria-label="Account menu"
          title="Field Analyst · DENR Region 1"
        >
          FA
        </button>
      </div>
    </header>
  )
}
