import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Check,
  ChevronsUpDown,
  Download,
  Globe2,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import { NAV_GROUPS } from '../config/navigation'
import { LeafMark } from './Logo'

function navLinkClasses(collapsed) {
  return ({ isActive }) =>
    `group relative flex h-8 items-center rounded-md text-[12px] font-medium transition-colors duration-150 ${
      collapsed
        ? 'justify-center px-0'
        : 'gap-2.5 px-2'
    } ${
      isActive
        ? 'bg-brand/10 text-brand'
        : 'text-muted hover:bg-hover hover:text-ink'
    }`
}

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  mobile = false,
  onNavigate,
  onClose,
  canInstall = false,
  isInstalled = false,
  onInstall,
}) {
  const [projectOpen, setProjectOpen] = useState(false)
  const projectRef = useRef(null)
  const iconOnly = collapsed && !mobile

  useEffect(() => {
    if (!projectOpen) return undefined

    const handlePointerDown = (event) => {
      if (projectRef.current && !projectRef.current.contains(event.target)) {
        setProjectOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [projectOpen])

  const handleNav = () => {
    onNavigate?.()
    setProjectOpen(false)
  }

  return (
    <aside
      className={`flex h-full shrink-0 flex-col border-r border-border bg-app transition-[width] duration-150 ${
        mobile ? 'w-[264px]' : iconOnly ? 'w-14' : 'w-[220px]'
      }`}
    >
      <div
        className={`flex h-12 shrink-0 items-center border-b border-border ${
          iconOnly ? 'justify-center px-2' : 'justify-between px-3'
        }`}
      >
        <NavLink
          to="/"
          onClick={handleNav}
          className="flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
          title="IAPS Monitor"
        >
          <LeafMark size={iconOnly ? 26 : 25} />
          {!iconOnly && (
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold tracking-[-0.01em] text-ink">
                IAPS Monitor
              </p>
              <p className="text-[9px] leading-3 text-subtle">Web GIS · AI</p>
            </div>
          )}
        </NavLink>
        {mobile && (
          <button type="button" onClick={onClose} className="btn-icon" aria-label="Close menu">
            <X size={16} />
          </button>
        )}
      </div>

      <div className={`shrink-0 ${iconOnly ? 'px-2 py-2' : 'px-2 py-2.5'}`} ref={projectRef}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setProjectOpen((current) => !current)}
            className={`flex w-full items-center rounded-md border border-border bg-panel text-left transition-colors duration-150 hover:border-[#c9c9c1] hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
              iconOnly ? 'h-9 justify-center px-0' : 'h-10 gap-2 px-2'
            }`}
            aria-haspopup="listbox"
            aria-expanded={projectOpen}
            title="Region 1 (Ilocos)"
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded border border-border bg-app text-muted ${
                iconOnly ? 'h-6 w-6' : 'h-6 w-6'
              }`}
            >
              <Globe2 size={13} />
            </div>
            {!iconOnly && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-medium text-ink">Region 1 (Ilocos)</p>
                  <p className="text-[9px] text-subtle">Philippines · DENR</p>
                </div>
                <ChevronsUpDown size={12} className="shrink-0 text-subtle" />
              </>
            )}
          </button>

          {projectOpen && !iconOnly && (
            <div
              className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg border border-border bg-panel p-1 animate-scale-in"
              role="listbox"
              aria-label="Select project region"
            >
              <div className="eyebrow px-2 pb-1.5 pt-1">Project scope</div>
              <button
                type="button"
                role="option"
                aria-selected="true"
                className="flex w-full items-start gap-2 rounded-md bg-brand/10 px-2 py-2 text-left"
                onClick={() => setProjectOpen(false)}
              >
                <MapPinIcon />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-brand">
                    Region 1 (Ilocos)
                    <Check size={11} />
                  </span>
                  <span className="block text-[9.5px] text-muted">
                    Ilocos Norte · Ilocos Sur · La Union · Pangasinan
                  </span>
                </span>
              </button>
              <div className="mt-1 border-t border-border px-2 pb-1 pt-2">
                <p className="text-[9.5px] leading-4 text-subtle">
                  Additional regions can be connected to this workspace.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="scroll-area min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className={groupIndex > 0 ? 'mt-4' : 'mt-1'}>
            {iconOnly ? (
              groupIndex > 0 && <div className="mx-1 mb-2 h-px bg-border" />
            ) : (
              <p className="eyebrow mb-1.5 px-2">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={handleNav}
                    className={navLinkClasses(iconOnly)}
                    title={iconOnly ? item.label : undefined}
                  >
                    <Icon size={15} className="shrink-0" strokeWidth={1.8} />
                    {!iconOnly && <span className="truncate">{item.label}</span>}
                    {iconOnly && (
                      <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 z-[60] hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-panel px-2 py-1 text-[10px] text-ink group-hover:block">
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`shrink-0 border-t border-border p-2 ${iconOnly ? 'space-y-1' : 'space-y-2'}`}>
        <button
          type="button"
          onClick={onInstall}
          className={`flex w-full items-center rounded-md border border-brand/25 bg-brand/[0.07] text-[11px] font-medium text-brand transition-colors duration-150 hover:border-brand/40 hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
            iconOnly ? 'h-8 justify-center' : 'h-8 gap-2 px-2'
          }`}
          title={isInstalled ? 'App installed' : 'Install app'}
        >
          {isInstalled ? <Check size={13} /> : <Download size={13} />}
          {!iconOnly && <span>{isInstalled ? 'App installed' : 'Install app'}</span>}
          {!iconOnly && !isInstalled && canInstall && (
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          )}
        </button>

        {!mobile && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-md text-[11px] text-subtle transition-colors duration-150 hover:bg-hover hover:text-ink ${
              iconOnly ? 'h-8 justify-center' : 'h-8 gap-2 px-2'
            }`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            {!iconOnly && (
              <>
                <span>Collapse</span>
                <span className="mono ml-auto text-[9px] text-subtle">v1.0</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  )
}

function MapPinIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-brand/20 bg-app text-brand">
      <Globe2 size={11} />
    </span>
  )
}
