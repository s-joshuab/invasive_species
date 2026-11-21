import { useCallback, useEffect, useRef, useState } from 'react'

export const FALLBACK_LOCATION = {
  lat: 18.1978,
  lng: 120.5936,
  accuracy: 25,
  source: 'fallback',
}

export function useGeolocation() {
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const locate = useCallback(() => {
    if (mountedRef.current) {
      setStatus('locating')
      setError(null)
    }

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        if (mountedRef.current) {
          setCoords(FALLBACK_LOCATION)
          setStatus('fallback')
          setError('Geolocation is not supported. Using a demo Ilocos coordinate.')
        }
        resolve(FALLBACK_LOCATION)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const next = {
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy || 0),
            source: 'gps',
          }

          if (mountedRef.current) {
            setCoords(next)
            setStatus('success')
            setError(null)
          }
          resolve(next)
        },
        (locationError) => {
          const messages = {
            1: 'Location permission denied. Using a demo Ilocos coordinate.',
            2: 'GPS position unavailable. Using a demo Ilocos coordinate.',
            3: 'GPS request timed out. Using a demo Ilocos coordinate.',
          }

          if (mountedRef.current) {
            setCoords(FALLBACK_LOCATION)
            setStatus('fallback')
            setError(
              messages[locationError.code] ||
                'Unable to read location. Using a demo Ilocos coordinate.',
            )
          }
          resolve(FALLBACK_LOCATION)
        },
        {
          enableHighAccuracy: true,
          timeout: 9000,
          maximumAge: 300000,
        },
      )
    })
  }, [])

  const reset = useCallback(() => {
    setCoords(null)
    setStatus('idle')
    setError(null)
  }, [])

  return {
    coords,
    status,
    error,
    locate,
    reset,
    isLocating: status === 'locating',
    isFallback: status === 'fallback',
  }
}
