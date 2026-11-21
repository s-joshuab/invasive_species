import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, CornerDownLeft, Flower2, Leaf, Search } from 'lucide-react'
import { NAV_GROUPS } from '../config/navigation'
import { mockSpecies } from '../data/mockSpecies'

const pageItems = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    kind: 'page',
    group: group.label,
    keywords: `${item.label} ${item.description} ${group.label}`,
  })),
)

const speciesItems = mockSpecies.map((species) => ({
  id: species.id,
  kind: 'species',
  label: species.commonName,
  description: `${species.scientificName} · ${species.status}`,
  keywords: `${species.commonName} ${species.scientificName} ${species.status} ${species.family}`,
  status: species.status,
}))

export function CommandPalette({ onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef([])

  const pageMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pageItems
    return pageItems.filter((item) => item.keywords.toLowerCase().includes(q))
  }, [query])

  const speciesMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return speciesItems
    return speciesItems.filter((item) => item.keywords.toLowerCase().includes(q))
  }, [query])

  const flatResults = useMemo(
    () => [...pageMatches, ...speciesMatches],
    [pageMatches, speciesMatches],
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const handleSelect = (item) => {
    if (!item) return
    onClose()
    if (item.kind === 'page') {
      navigate(item.to)
    } else {
      navigate(`/species?q=${encodeURIComponent(item.label)}`)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (!flatResults.length) return
        setActiveIndex((current) => (current + 1) % flatResults.length)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (!flatResults.length) return
        setActiveIndex((current) => (current - 1 + flatResults.length) % flatResults.length)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        handleSelect(flatResults[activeIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const pageOffset = 0
  const speciesOffset = pageMatches.length
  const hasResults = flatResults.length > 0

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[12vh] sm:px-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/60 animate-fade-in"
        aria-label="Close command palette"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-border bg-panel shadow-[0_28px_90px_rgba(0,0,0,0.55)] animate-scale-in"
      >
        <div className="flex h-12 items-center gap-2.5 border-b border-border px-3">
          <Search size={16} className="shrink-0 text-subtle" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            autoFocus
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-subtle"
            placeholder="Search pages, species, scientific names…"
            aria-label="Search pages and species"
          />
          <kbd className="mono hidden rounded border border-border bg-app px-1.5 py-0.5 text-[9px] text-subtle sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[min(420px,56vh)] overflow-y-auto p-1.5">
          {!hasResults && (
            <div className="px-4 py-10 text-center">
              <p className="text-[12px] font-medium text-ink">No results found</p>
              <p className="mt-1 text-[11px] text-subtle">
                Try a species name or a dashboard page.
              </p>
            </div>
          )}

          {pageMatches.length > 0 && (
            <div>
              <p className="eyebrow px-2 pb-1 pt-2">Navigate</p>
              {pageMatches.map((item, index) => {
                const Icon = item.icon
                const globalIndex = pageOffset + index
                return (
                  <button
                    key={item.to}
                    ref={(node) => {
                      itemRefs.current[globalIndex] = node
                    }}
                    type="button"
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                    onClick={() => handleSelect(item)}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-75 ${
                      globalIndex === activeIndex ? 'bg-brand/10' : 'hover:bg-hover/70'
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-app text-muted">
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-ink">{item.label}</span>
                      <span className="block truncate text-[10px] text-subtle">
                        {item.description}
                      </span>
                    </span>
                    <span className="mono text-[9px] text-subtle">{item.group}</span>
                  </button>
                )
              })}
            </div>
          )}

          {speciesMatches.length > 0 && (
            <div className={pageMatches.length ? 'mt-1 border-t border-border pt-1' : ''}>
              <p className="eyebrow px-2 pb-1 pt-2">Species</p>
              {speciesMatches.map((item, index) => {
                const globalIndex = speciesOffset + index
                const Icon = item.status === 'Invasive' ? Leaf : Flower2
                return (
                  <button
                    key={item.id}
                    ref={(node) => {
                      itemRefs.current[globalIndex] = node
                    }}
                    type="button"
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                    onClick={() => handleSelect(item)}
                    className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-75 ${
                      globalIndex === activeIndex ? 'bg-brand/10' : 'hover:bg-hover/70'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border bg-app ${
                        item.status === 'Invasive'
                          ? 'border-inv-high/20 text-inv-high'
                          : 'border-native/20 text-native'
                      }`}
                    >
                      <Icon size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-ink">{item.label}</span>
                      <span className="mono block truncate text-[10px] text-subtle">
                        {item.description}
                      </span>
                    </span>
                    <span
                      className={`text-[9px] font-medium ${
                        item.status === 'Invasive' ? 'text-inv-high' : 'text-native'
                      }`}
                    >
                      {item.status}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border bg-app px-3 py-2 text-[9.5px] text-subtle">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-app p-0.5">
              <ArrowUp size={10} />
            </kbd>
            <kbd className="rounded border border-border bg-app p-0.5">
              <ArrowDown size={10} />
            </kbd>
            to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-app p-0.5">
              <CornerDownLeft size={10} />
            </kbd>
            to select
          </span>
          <span className="ml-auto hidden sm:block">IAPS Monitor command menu</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
