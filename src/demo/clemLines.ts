import type { ClemMessage } from '../components/ClemDialogue'

/**
 * The house voice: upbeat, second person, one idea per line, and always
 * pointing somewhere. Exclamation marks are free but not unlimited.
 */
export const HOME_LINES: ClemMessage[] = [
  {
    text: 'Looking for something? Try clicking About to learn more about Mark!',
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
]

export const ABOUT_LINES: ClemMessage[] = [
  {
    text: 'Ooh, the About page! This is where Mark keeps all the good stuff.',
    mood: 'excited',
  },
  {
    text: 'He drew me himself, you know. Every tentacle. Hand-made!',
    mood: 'idle',
  },
]

export const PROJECTS_LINES: ClemMessage[] = [
  {
    text: 'Whoa! Mark built every single one of these. With his own two hands!',
    mood: 'surprised',
  },
  {
    text: 'Clicking things is how you find out what they do. That is my best advice.',
    mood: 'sly',
  },
]

export const NUDGE_LINES: ClemMessage[] = [
  {
    text: "Hey! Still there? Take your time — I'm not going anywhere.",
    mood: 'curious',
  },
]
