import { useEffect, useState } from 'react'

/**
 * Starts at `false` so server-rendered markup matches the first client render;
 * the real value lands in the effect. The stylesheet carries its own
 * `prefers-reduced-motion` block, so motion is suppressed even in that first
 * frame — this hook exists for the behaviour CSS can't reach, like skipping
 * the typewriter.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
