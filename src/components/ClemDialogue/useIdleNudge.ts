import { useEffect, useRef } from 'react'

/**
 * Calls `onIdle` once `after` ms have passed with no change to `resetKey`.
 * Every interaction bumps the key, which restarts the countdown.
 */
export function useIdleNudge({
  enabled,
  after,
  resetKey,
  onIdle,
}: {
  enabled: boolean
  after: number
  resetKey: unknown
  onIdle: () => void
}): void {
  // Held in a ref so a fresh callback identity each render doesn't restart the
  // countdown — only `resetKey` should do that.
  const onIdleRef = useRef(onIdle)
  useEffect(() => {
    onIdleRef.current = onIdle
  })

  useEffect(() => {
    if (!enabled || after <= 0) return

    const timer = window.setTimeout(() => onIdleRef.current(), after)
    return () => window.clearTimeout(timer)
  }, [enabled, after, resetKey])
}
