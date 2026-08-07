import { useEffect, useState } from 'react'

/**
 * Resolves to true once `delayMs` has passed since mount. A delay of 0 (or
 * less) resolves synchronously, so the component never flashes a frame of
 * "not yet" when the caller has opted out.
 */
export function useDelayedAppearance(delayMs: number): boolean {
  const [elapsed, setElapsed] = useState(() => delayMs <= 0)

  useEffect(() => {
    if (delayMs <= 0) {
      setElapsed(true)
      return
    }

    setElapsed(false)
    const timer = window.setTimeout(() => setElapsed(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  return elapsed
}
