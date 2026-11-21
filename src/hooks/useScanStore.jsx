import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { get as idbGet, set as idbSet } from 'idb-keyval'

const SCANS_KEY = 'iaps-region1-field-scans'
const ScanStoreContext = createContext(null)

async function persistScans(scans) {
  try {
    await idbSet(SCANS_KEY, scans)
  } catch (error) {
    console.error('Unable to persist scans to IndexedDB', error)
  }
}

export function ScanStoreProvider({ children }) {
  const [scans, setScans] = useState([])
  const scansRef = useRef([])
  const [loading, setLoading] = useState(true)
  const [storageError, setStorageError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadScans() {
      try {
        const saved = await idbGet(SCANS_KEY)
        if (!cancelled) {
          const initial = Array.isArray(saved) ? saved : []
          scansRef.current = initial
          setScans(initial)
        }
      } catch (error) {
        console.error('Unable to read scans from IndexedDB', error)
        if (!cancelled) setStorageError('Local field storage is unavailable in this browser.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadScans()

    return () => {
      cancelled = true
    }
  }, [])

  const saveScan = useCallback(async (scan) => {
    const record = {
      ...scan,
      id: scan.id || `FLD-${Date.now().toString().slice(-6)}`,
      savedAt: new Date().toISOString(),
      syncStatus: navigator.onLine ? 'Synced' : 'Pending sync',
      syncedAt: navigator.onLine ? new Date().toISOString() : null,
    }

    const next = [record, ...scansRef.current]
    scansRef.current = next
    setScans(next)
    await persistScans(next)
    return record
  }, [])

  const syncPending = useCallback(async () => {
    const syncedCount = scansRef.current.filter(
      (scan) => scan.syncStatus === 'Pending sync',
    ).length

    const next = scansRef.current.map((scan) =>
      scan.syncStatus === 'Pending sync'
        ? {
            ...scan,
            syncStatus: 'Synced',
            syncedAt: new Date().toISOString(),
          }
        : scan,
    )

    scansRef.current = next
    setScans(next)
    await persistScans(next)
    return syncedCount
  }, [])

  const pendingCount = useMemo(
    () => scans.filter((scan) => scan.syncStatus === 'Pending sync').length,
    [scans],
  )

  const value = useMemo(
    () => ({
      scans,
      loading,
      storageError,
      pendingCount,
      saveScan,
      syncPending,
    }),
    [scans, loading, storageError, pendingCount, saveScan, syncPending],
  )

  return <ScanStoreContext.Provider value={value}>{children}</ScanStoreContext.Provider>
}

export function useScanStore() {
  const context = useContext(ScanStoreContext)
  if (!context) {
    throw new Error('useScanStore must be used within a ScanStoreProvider')
  }
  return context
}
