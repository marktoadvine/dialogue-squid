import type { ClemMessage } from '../components/ClemDialogue'

/**
 * The house voice: upbeat, second person, one idea per line, and always
 * pointing somewhere. Exclamation marks are free but not unlimited.
 */
export const CLEM_LINES: ClemMessage[] = [
  {
    text: 'Looking for something? Try clicking “About” to learn more about Mark!',
    mood: 'curious',
  },
  {
    text: "See that little arrow? It means I've got more to say. Go on, click it!",
    mood: 'excited',
  },
  {
    text: 'Squid fact: I have three hearts! Mark only has one, but he spends it all on CSS.',
    mood: 'sly',
  },
  {
    text: 'Whoa! You made it to the end. That is genuinely all I had.',
    mood: 'happy',
  },
]

export const NUDGE_LINES: ClemMessage[] = [
  {
    text: "Hey! Still there? Take your time — I'm not going anywhere.",
    mood: 'curious',
  },
]
