# dialogue-squid

Meet **Clem** — a game-style dialogue popup for React. He pops up at the bottom of the
page a beat after load, perches on top of his own dialogue box, and tells your visitors
where to click. He has no mouth; the eyebrows do all the talking.

![Clem perched on his dialogue box](docs/preview.png)

No runtime dependencies beyond React. 12 kB of JS, one stylesheet, one hand-drawn SVG.

---

## Install

```bash
npm install github:marktoadvine/dialogue-squid
```

```tsx
import { ClemDialogue } from 'dialogue-squid'
import 'dialogue-squid/styles.css'

<ClemDialogue
  messages={[
    'Looking for something? Try clicking “About” to learn more about Mark!',
    { text: 'Squid fact: I have three hearts!', mood: 'sly' },
  ]}
/>
```

That's the whole integration. React is a peer dependency (`>=18`); nothing else is
required.

### The font

Clem is set in [Slackey](https://fonts.google.com/specimen/Slackey). It is **optional** —
without it he falls back to a rounded system stack and nothing breaks. To get the real
thing, install it and import it once in your app entry:

```bash
npm install @fontsource/slackey
```

```tsx
import '@fontsource/slackey'
```

Self-hosted, so there's no CDN request. Prefer a different face? Skip the install and set
`--clem-font` instead.

### Copying the source instead

If you'd rather own the code than depend on it, copy `src/components/ClemDialogue/` into
your project and import from the folder. It pulls in nothing but React — the font is the
app's job, not the component's, so there's no hidden dependency to trip over.

### Running the demo

```bash
git clone https://github.com/marktoadvine/dialogue-squid && cd dialogue-squid
npm install && npm run dev
```

A deliberately empty page with nothing on it but Clem, and a small toggle in the corner
for flipping the backdrop between white and dark.

Slackey ships a single weight, so hierarchy inside the panel comes from size and colour
rather than bold-vs-regular — worth knowing if you restyle it.

---

## Props

| Prop | Type | Default | What it does |
| --- | --- | --- | --- |
| `messages` | `Array<string \| ClemMessage>` | — | The queue. Plain strings get the default mood. |
| `open` | `boolean` | — | Controlled visibility. Omit to let Clem manage himself. |
| `defaultOpen` | `boolean` | `true` | Initial visibility when uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Fires whenever he opens or closes. |
| `onDismiss` | `() => void` | — | Fires when he's dismissed specifically. |
| `onMessageChange` | `(index, message) => void` | — | Fires as the queue advances. |
| `onAction` | `(message) => void` | — | Fires when a message's action is clicked. |
| `name` | `string` | `'CLEM'` | The label above the message. |
| `appearDelayMs` | `number` | `2500` | Wait before his first appearance. `0` disables. |
| `typeSpeed` | `number` | `28` | Milliseconds per character. |
| `side` | `'left' \| 'right'` | `'left'` | Which corner of the *panel* Clem perches on. The panel itself is always centred. |
| `autoAdvanceMs` | `number \| null` | `null` | Auto-advance this long after a line lands. |
| `idleNudge` | `ClemIdleNudge \| null` | `null` | Have him pipe up after a quiet stretch. |
| `className` | `string` | — | Applied to the outermost element. |

### Messages

The panel is fixed to the bottom centre of the viewport. `side` moves Clem from one end of
its top edge to the other — and takes the dismiss button with it, to the opposite corner.

```ts
type ClemMood = 'idle' | 'curious' | 'excited' | 'sly' | 'happy'

interface ClemMessage {
  id?: string
  text: string
  mood?: ClemMood                 // reshapes his eye mask — there is no mouth
  action?: {
    label: string
    onClick?: () => void
    href?: string                 // renders a link instead of a button
  }
}
```

| Mood | |
| --- | --- |
| `idle` | Neutral. |
| `curious` | One brow up. |
| `excited` | Wide-eyed. |
| `sly` | Half-lidded, eyes open — the smirk. |
| `happy` | Eyes closed, two upward arcs — the cheeky one. |

Expression is the mask itself changing shape, animated through the CSS `d` property. That
needs Chrome/Edge 98+, Firefox 97+, or Safari 16.4+. Below that the morphs are skipped and
Clem keeps his neutral mask — he still blinks and everything else works, so it degrades
rather than breaking.

### The idle nudge

```tsx
<ClemDialogue
  messages={homeLines}
  idleNudge={{
    after: 12000,
    messages: ["Hey! Still there? Take your time."],
    repeat: true,
  }}
/>
```

Any interaction resets the countdown. Without `repeat`, he nudges once and then leaves
you alone.

### How advancing works

Clicking the panel does what it does in a game: if the line is still typing, the first
click finishes it; the next one moves on. The chevron is the same control for keyboard
and screen-reader users, and it stays visible throughout so nothing focusable is ever
invisible. `Escape` dismisses.

---

## Theming

Every colour, size and timing is a custom property on the root element. Override them
from your own stylesheet — no need to touch the module.

| Variable | Default | |
| --- | --- | --- |
| `--clem-body` | `#ffd23f` | All of Clem. One flat colour, no shading |
| `--clem-ink` | `#16121f` | Eye mask, pupils, lids |
| `--clem-accent` | `#ffd23f` | Name, chevron, caret |
| `--clem-text` | `#ffffff` | Message text |
| `--clem-panel` | `rgb(10 10 12 / 0.9)` | The bubble |
| `--clem-panel-blur` | `3px` | Backdrop blur behind the bubble |
| `--clem-font` | `'Slackey', …` | Typeface for the whole component |
| `--clem-z` | `9999` | Stacking order |
| `--clem-offset` | `clamp(0.75rem, 3vw, 2rem)` | Distance from the viewport edges |
| `--clem-size` | `88px` | Clem's height |
| `--clem-perch` | `30px` | How far his tentacles dangle over the panel |
| `--clem-headroom` | `2.35rem` | Top padding that gives the dangle somewhere to go |

The `className` prop lands on the element that declares them, so that's the hook:

```tsx
<ClemDialogue className="clem-mint" messages={lines} />
```

```css
/* A plain global stylesheet — the component's own class names are hashed by
   CSS Modules, so this is the stable way in. */
.clem-mint {
  --clem-body: #8ef0c4;
  --clem-accent: #8ef0c4;
  --clem-panel: rgb(18 8 30 / 0.92);
}
```

`--clem-perch` and `--clem-headroom` move together. The headroom is the band of top
padding his tentacles hang into; if you raise the perch past it, they land on the name.

---

## Using it elsewhere

**Astro** — CSS Modules work natively (Astro runs on Vite), so the component drops in as
an island with no extra config:

```astro
---
import { ClemDialogue } from '../components/ClemDialogue'
---
<ClemDialogue client:visible messages={["Looking for something?"]} />
```

**Next.js (App Router)** — nothing to do. The package ships with `'use client'` on the
bundle, so he works in a server-rendered tree as-is.

**Vite / CRA** — nothing special; the quick start above is it.

---

## Accessibility

- **Not a modal.** No focus trap, no `aria-modal`, and he never steals focus on mount.
- The typewriter is `aria-hidden`; the *complete* line is announced once through a
  visually hidden `aria-live="polite"` region. Announcing the animated text directly would
  read it out one character at a time.
- Every control is a real `<button>` with a label, and `Escape` dismisses.
- `prefers-reduced-motion` is respected twice over — in the stylesheet, so it holds before
  hydration, and in JS, which skips the typewriter and the look-around loop.
- Measured contrast over the worst case (the translucent panel on a white page):
  **15.8:1** for the message text at 16px, **10.9:1** for the name. Both clear WCAG AAA.

---

## Scripts

| | |
| --- | --- |
| `npm run dev` | Blank page with Clem on it |
| `npm run build` | Library then demo |
| `npm run build:lib` | The publishable library → `dist/` |
| `npm run build:demo` | The demo page → `dist-demo/` |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | ESLint |

---

## A note on the design

The layout takes its cue from game dialogue boxes generally — a bottom-anchored bubble, a
named speaker, typewriter text. The specifics are original: no hazard-stripe tape, no
square portrait frame, no dotted-line name tag, original palette, original character.
Clem is his own squid.

Three things about him are load-bearing rather than decorative.

**Nothing on the character is stroked.** Every shape is a flat fill in one colour, so
separation comes from gaps in the geometry — which is why his tentacles and the nubs along
his hem are spaced the way they are.

**The whole face is one graphic**: a black mask, a white well clipped inside it, and two
pupils. Every expression is those two paths changing shape together. Moving the *well* is
what thickens or thins the black above each eye — that's the eyebrow. Moving the *mask*
lets the whole thing squash or arc. A lid still exists, but only to blink.

Because `d` interpolates only between paths with an identical command sequence, every mood
in `Clem.module.css` is the same eight cubic curves with the control points moved. If you
add a mood, move the points — never add or remove a segment, or it will snap instead of
morph.

**His tentacles are shaped to carry weight.** They bend outward and flatten where they meet
the panel, and the idle sway is deliberately tiny with its pivot up at the attachment, so
the tips stay planted. A wider sway would undo the whole effect.
