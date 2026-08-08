import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import '@fontsource/slackey'
import { Clem, InkSplat } from './Clem'
import { toMessage } from './types'
import type { ClemDialogueProps, ClemMessage } from './types'
import { useDelayedAppearance } from './useDelayedAppearance'
import { useIdleNudge } from './useIdleNudge'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useTypewriter } from './useTypewriter'
import styles from './ClemDialogue.module.css'

/** How often Clem leans over and scans the page while a line sits read. */
const LOOK_INTERVAL_MS = 7200
const LOOK_HOLD_MS = 1900

export function ClemDialogue({
  messages,
  open,
  defaultOpen = true,
  onOpenChange,
  onDismiss,
  onMessageChange,
  onAction,
  name = 'CLEM',
  appearDelayMs = 2500,
  typeSpeed = 28,
  side = 'left',
  autoAdvanceMs = null,
  idleNudge = null,
  className,
}: ClemDialogueProps) {
  const isControlled = open !== undefined
  const reducedMotion = usePrefersReducedMotion()
  const delayElapsed = useDelayedAppearance(appearDelayMs)

  const baseQueue = useMemo(() => messages.map(toMessage), [messages])

  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [queue, setQueue] = useState<ClemMessage[]>(baseQueue)
  const [index, setIndex] = useState(0)
  const [hasAppeared, setHasAppeared] = useState(false)
  const [looking, setLooking] = useState(false)
  const [interactions, setInteractions] = useState(0)
  const [nudgeCount, setNudgeCount] = useState(0)

  // Consumers routinely pass inline arrows. Reading callbacks through a ref
  // keeps a new identity every render from re-firing the effects below.
  const handlers = useRef({ onOpenChange, onDismiss, onMessageChange, onAction })
  useEffect(() => {
    handlers.current = { onOpenChange, onDismiss, onMessageChange, onAction }
  })

  // A new message list restarts the conversation, including out of a nudge.
  useEffect(() => {
    setQueue(baseQueue)
    setIndex(0)
  }, [baseQueue])

  const requestedOpen = isControlled ? Boolean(open) : uncontrolledOpen
  // The delay gates only the first appearance; afterwards opening is instant.
  const visible = requestedOpen && (hasAppeared || delayElapsed)

  useEffect(() => {
    if (visible && !hasAppeared) setHasAppeared(true)
  }, [visible, hasAppeared])

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next)
      handlers.current.onOpenChange?.(next)
    },
    [isControlled],
  )

  const message = queue.length > 0 ? queue[Math.min(index, queue.length - 1)] : null
  const text = message?.text ?? ''

  const typewriter = useTypewriter(text, {
    speed: typeSpeed,
    enabled: !reducedMotion && visible,
  })

  useEffect(() => {
    if (message) handlers.current.onMessageChange?.(index, message)
  }, [index, message])

  const bump = useCallback(() => setInteractions((n) => n + 1), [])

  const dismiss = useCallback(() => {
    setOpen(false)
    handlers.current.onDismiss?.()
    bump()
  }, [setOpen, bump])

  const step = useCallback(() => {
    setIndex((current) => {
      if (current < queue.length - 1) return current + 1
      dismiss()
      return current
    })
  }, [queue.length, dismiss])

  const advance = useCallback(() => {
    bump()
    // First click completes the line, second moves on — standard game feel.
    if (!typewriter.isComplete) {
      typewriter.skip()
      return
    }
    step()
  }, [bump, typewriter, step])

  // Auto-advance, once the line has finished typing.
  useEffect(() => {
    if (!visible || autoAdvanceMs === null || autoAdvanceMs <= 0) return
    if (!typewriter.isComplete) return

    const timer = window.setTimeout(step, autoAdvanceMs)
    return () => window.clearTimeout(timer)
  }, [visible, autoAdvanceMs, typewriter.isComplete, index, step])

  // Escape closes. Clem is not modal, so this is a convenience, not a trap.
  useEffect(() => {
    if (!visible) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, dismiss])

  // The look-around loop.
  useEffect(() => {
    if (!visible || reducedMotion) return

    let holdTimer = 0
    const interval = window.setInterval(() => {
      setLooking(true)
      holdTimer = window.setTimeout(() => setLooking(false), LOOK_HOLD_MS)
    }, LOOK_INTERVAL_MS)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(holdTimer)
      setLooking(false)
    }
  }, [visible, reducedMotion])

  const nudgeMessages = useMemo(
    () => (idleNudge ? idleNudge.messages.map(toMessage) : []),
    [idleNudge],
  )
  const nudgeRef = useRef(nudgeMessages)
  useEffect(() => {
    nudgeRef.current = nudgeMessages
  })

  useIdleNudge({
    enabled:
      nudgeMessages.length > 0 &&
      hasAppeared &&
      (idleNudge?.repeat === true || nudgeCount === 0),
    after: idleNudge?.after ?? 0,
    resetKey: interactions,
    onIdle: () => {
      setQueue(nudgeRef.current)
      setIndex(0)
      setNudgeCount((n) => n + 1)
      setOpen(true)
    },
  })

  if (!visible || !message) return null

  const action = message.action
  const stop = (event: ReactMouseEvent) => event.stopPropagation()

  const handleAction = (event: ReactMouseEvent) => {
    stop(event)
    bump()
    handlers.current.onAction?.(message)
    action?.onClick?.()
  }

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-side={side}
    >
      <div className={styles.stage}>
        {/* Clem perches on the panel's top edge with his tentacles dangling
            over the front. The inner element carries the entrance animation
            so the positioning stays independent of the pop. */}
        <div className={styles.mascot}>
          <div className={styles.mascotInner}>
            <InkSplat className={styles.splat} />
            <Clem
              mood={message.mood ?? 'idle'}
              talking={!typewriter.isComplete}
              looking={looking}
              stillness={reducedMotion}
            />
          </div>
        </div>

        {/* Clicking the slab advances, the way a game dialogue box does. The
            chevron below is the real control for keyboard and assistive tech. */}
        <div className={styles.panel} role="presentation" onClick={advance}>
          <span className={styles.name}>{name}</span>

          <p className={styles.text} aria-hidden="true">
            {typewriter.shown}
            {!typewriter.isComplete && <span className={styles.caret} />}
          </p>

          {/* Announcing the finished line, not each typed character. */}
          <span className={styles.srOnly} aria-live="polite">
            {text}
          </span>

          {action &&
            (action.href ? (
              <a
                className={styles.action}
                href={action.href}
                onClick={handleAction}
              >
                {action.label}
              </a>
            ) : (
              <button className={styles.action} type="button" onClick={handleAction}>
                {action.label}
              </button>
            ))}

          <button
            className={styles.dismiss}
            type="button"
            aria-label={`Dismiss ${name}`}
            onClick={(event) => {
              stop(event)
              dismiss()
            }}
          >
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M3 3 L13 13 M13 3 L3 13"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            className={styles.next}
            type="button"
            aria-label={
              !typewriter.isComplete
                ? 'Skip to the end of this line'
                : index < queue.length - 1
                  ? 'Next message'
                  : 'Close'
            }
            data-ready={typewriter.isComplete ? 'true' : 'false'}
            onClick={(event) => {
              stop(event)
              advance()
            }}
          >
            <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
              <path
                d="M3 6 L8 11 L13 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
