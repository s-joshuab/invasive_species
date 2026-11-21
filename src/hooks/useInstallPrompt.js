import { useCallback, useEffect, useState } from 'react'

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplay)

  useEffect(() => {
    const handleBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }
    const handleInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: 'unavailable' }

    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (choice.outcome === 'accepted') setIsInstalled(true)
    return choice
  }, [deferredPrompt])

  return {
    canInstall: Boolean(deferredPrompt),
    isInstalled,
    promptInstall,
  }
}
