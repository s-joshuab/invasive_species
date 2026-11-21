import { useEffect, useRef, useState } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { MobileTabBar } from './components/MobileTabBar'
import { CommandPalette } from './components/CommandPalette'
import { ToastProvider, useToast } from './components/Toast'
import { ScanStoreProvider, useScanStore } from './hooks/useScanStore'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { PAGE_LABELS } from './config/navigation'
import { Dashboard } from './pages/Dashboard'
import { Scanner } from './pages/Scanner'
import { HotspotMap } from './pages/HotspotMap'
import { SpeciesDatabase } from './pages/SpeciesDatabase'
import { EradicationLogs } from './pages/EradicationLogs'
import { Reports } from './pages/Reports'

function SyncBridge() {
  const isOnline = useOnlineStatus()
  const { pendingCount, syncPending } = useScanStore()
  const { showToast } = useToast()
  const wasOnlineRef = useRef(isOnline)

  useEffect(() => {
    const cameBackOnline = !wasOnlineRef.current && isOnline
    wasOnlineRef.current = isOnline

    if (!cameBackOnline || pendingCount === 0) return

    showToast({
      type: 'success',
      title: 'You are back online',
      description: `${pendingCount} field scan${pendingCount > 1 ? 's are' : ' is'} waiting to sync.`,
      duration: 9000,
      action: {
        label: 'Sync now',
        onClick: async () => {
          const synced = await syncPending()
          if (synced > 0) {
            showToast({
              type: 'success',
              title: `${synced} scan${synced > 1 ? 's' : ''} synced`,
              description: 'Local field records were marked as synced (mock).',
            })
          }
        },
      },
    })
  }, [isOnline, pendingCount, showToast, syncPending])

  return null
}

function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem('iaps-sidebar-collapsed') === '1'
    } catch {
      return false
    }
  })
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const location = useLocation()
  const { showToast } = useToast()
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt()

  useEffect(() => {
    try {
      window.localStorage.setItem('iaps-sidebar-collapsed', sidebarCollapsed ? '1' : '0')
    } catch (error) {
      console.warn('Unable to save sidebar preference', error)
    }
  }, [sidebarCollapsed])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.title = `${PAGE_LABELS[location.pathname] || 'Dashboard'} · IAPS Region 1`
  }, [location.pathname])

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen((current) => !current)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined
    const handleEscape = (event) => {
      if (event.key === 'Escape') setMobileSidebarOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [mobileSidebarOpen])

  const handleInstall = async () => {
    if (isInstalled) {
      showToast({
        type: 'info',
        title: 'IAPS Monitor is installed',
        description: 'Open it from your home screen or installed apps.',
      })
      return
    }

    if (canInstall) {
      const choice = await promptInstall()
      if (choice.outcome === 'accepted') {
        showToast({
          type: 'success',
          title: 'Installing IAPS Monitor',
          description: 'The app is being added to your device.',
        })
      }
      return
    }

    showToast({
      type: 'info',
      title: 'Install from your browser menu',
      description:
        'Use “Install app” or “Add to Home Screen”. Installation prompts require a supported browser and HTTPS.',
      duration: 6500,
    })
  }

  return (
    <div className="flex min-h-screen bg-app text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[130] focus:rounded focus:bg-brand focus:px-3 focus:py-2 focus:text-[12px] focus:text-white"
      >
        Skip to content
      </a>

      <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          canInstall={canInstall}
          isInstalled={isInstalled}
          onInstall={handleInstall}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenSearch={() => setCommandOpen(true)}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <main id="main-content" className="min-h-0 flex-1 pb-[58px] lg:pb-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/map" element={<HotspotMap />} />
            <Route path="/species" element={<SpeciesDatabase />} />
            <Route path="/eradication" element={<EradicationLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <MobileTabBar />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60 animate-fade-in"
            aria-label="Close navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 animate-slide-in-left">
            <Sidebar
              mobile
              onClose={() => setMobileSidebarOpen(false)}
              onNavigate={() => setMobileSidebarOpen(false)}
              canInstall={canInstall}
              isInstalled={isInstalled}
              onInstall={handleInstall}
            />
          </div>
        </div>
      )}

      {commandOpen && (
        <CommandPalette onClose={() => setCommandOpen(false)} />
      )}
      <SyncBridge />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScanStoreProvider>
          <AppShell />
        </ScanStoreProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
