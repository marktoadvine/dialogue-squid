import { useCallback, useEffect, useRef, useState } from 'react'

export interface Typewriter {
  /** The slice of text revealed so far. */
  shown: string
  isComplete: boolean
  /** Reveal the rest immediately — the first click of the classic two-click advance. */
  skip: () => void
}

/**
 * Reveals `text` one character at a time. When `enabled` is false the whole
 * string is present from the start, which is what reduced-motion callers want.
 */
export function useTypewriter(
  text: string,
  { speed, enabled }: { speed: number; enabled: boolean },
): Typewriter {
  const [count, setCount] = useState(() => (enabled ? 0 : text.length))
  const timerRef = useRef<number | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    clearTimer()

    if (!enabled || speed <= 0) {
      setCount(text.length)
      return
    }

    setCount(0)
    if (text.length === 0) return

    let revealed = 0
    timerRef.current = window.setInterval(() => {
      revealed += 1
      setCount(revealed)
      if (revealed >= text.length) clearTimer()
    }, speed)

    return clearTimer
  }, [text, speed, enabled, clearTimer])

  // Stopping the interval matters as much as setting the count — otherwise the
  // next tick would rewind the text back to mid-reveal.
  const skip = useCallback(() => {
    clearTimer()
    setCount(text.length)
  }, [clearTimer, text.length])

  return {
    shown: text.slice(0, count),
    isComplete: count >= text.length,
    skip,
  }
}
