/** The expressions Clem can pull. Drives his brows and mouth. */
export type ClemMood = 'idle' | 'curious' | 'excited' | 'sly' | 'surprised'

/** An optional button rendered inside the panel, under the message. */
export interface ClemAction {
  label: string
  onClick?: () => void
  /** Renders the action as a link instead of a button. */
  href?: string
}

export interface ClemMessage {
  /** Stable identity. Falls back to the index when omitted. */
  id?: string
  text: string
  /** Defaults to 'idle'. */
  mood?: ClemMood
  action?: ClemAction
}

/**
 * Has Clem pipe up on his own after a stretch of no interaction — the classic
 * "hey, still there?" helper nudge.
 */
export interface ClemIdleNudge {
  /** Milliseconds of quiet before Clem speaks up. */
  after: number
  messages: Array<string | ClemMessage>
  /** Nudge again after each subsequent quiet stretch. Defaults to false. */
  repeat?: boolean
}

export interface ClemDialogueProps {
  /** Plain strings are fine; they become messages with the default mood. */
  messages: Array<string | ClemMessage>
  /** Controlled visibility. Leave undefined to let Clem manage himself. */
  open?: boolean
  /** Initial visibility in uncontrolled mode. Defaults to true. */
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onDismiss?: () => void
  onMessageChange?: (index: number, message: ClemMessage) => void
  onAction?: (message: ClemMessage) => void
  /** The name on the label. Defaults to 'CLEM'. */
  name?: string
  /**
   * How long to wait before Clem's first appearance, in ms. Defaults to 2500.
   * Only gates the *first* appearance — later opens are immediate. 0 disables.
   */
  appearDelayMs?: number
  /** Milliseconds per character for the typewriter. Defaults to 28. */
  typeSpeed?: number
  /** Which side of the screen Clem occupies. Defaults to 'left'. */
  side?: 'left' | 'right'
  /** Advance automatically this long after a line finishes typing. */
  autoAdvanceMs?: number | null
  idleNudge?: ClemIdleNudge | null
  className?: string
}

/** Widens the string shorthand into a full message. */
export function toMessage(input: string | ClemMessage): ClemMessage {
  return typeof input === 'string' ? { text: input } : input
}
