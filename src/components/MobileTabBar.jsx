import { NavLink } from 'react-router-dom'
import { ClipboardList, LayoutDashboard, Leaf, Map, ScanLine } from 'lucide-react'

const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/scanner', label: 'Scan', icon: ScanLine, primary: true },
  { to: '/species', label: 'Species', icon: Leaf },
  { to: '/eradication', label: 'Logs', icon: ClipboardList },
]

export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-panel pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid h-[58px] grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon
          if (item.primary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex flex-col items-center justify-end pb-1.5 text-[9px] font-medium text-muted"
                aria-label="AI Scanner"
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-panel transition-colors duration-150 ${
                        isActive
                          ? 'bg-brand text-white'
                          : 'bg-[#e8f2ec] text-brand'
                      }`}
                    >
                      <Icon size={21} strokeWidth={2} />
                    </span>
                    <span className={isActive ? 'text-brand' : 'text-muted'}>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors duration-150 ${
                  isActive ? 'text-brand' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2 : 1.7} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
