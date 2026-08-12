import type { ClemMessage } from '../components/ClemDialogue'

/**
 * The house voice: upbeat, second person, one idea per line, and always
 * pointing somewhere. Exclamation marks are free but not unlimited.
 */
export const CLEM_LINES: ClemMessage[] = [
  {
    text: '*bluuurrp* ... Looking for something? Try clicking “About” to learn more!',
    mood: 'happy',
  },
  {
    text: "See that arrow? It means I've got lots to say. Go on, click it, dudes!",
    mood: 'excited',
  },
  {
    text: 'Squid fact: I have three hearts! Humans only have one.',
    mood: 'sly',
  },
  {
    text: 'Whoa! You made it to the end. You want some ink?',
    mood: 'curious',
  },
]

export const NUDGE_LINES: ClemMessage[] = [
  {
    text: "*blurp*.. Still there? Take your time, I'm just swimmin'.",
    mood: 'curious',
  },
]
