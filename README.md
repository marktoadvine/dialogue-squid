# dialogue-squid

Meet **Clem** — a game-style dialogue popup for React. He rises from the bottom of the
page a beat after load, peers over the top of his own dialogue box, raises his eyebrows,
and tells your visitors where to click.

![Clem peering over his dialogue box](docs/preview.png)

Zero runtime dependencies. One CSS Module, one hand-drawn SVG, and a handful of hooks.

---

## Quick start

```bash
npm install
npm run dev
```

That opens a demo playground — a stand-in mini-site with controls for Clem's side, type
speed, appear delay, and the page backdrop behind him.

To use him in your own app:

```tsx
import { ClemDialogue } from './components/ClemDialogue'

<ClemDialogue
  messages={[
    'Looking for something? Try clicking About to learn more about Mark!',
    { text: 'Squid fact: I have three hearts!', mood: 'sly' },
  ]}
/>
```

Copy `src/components/ClemDialogue/` into your project. It imports nothing outside itself
except React and the font (below).

### The font

Clem is set in [Slackey](https://fonts.google.com/specimen/Slackey), self-hosted so
there's no CDN request:

```bash
npm install @fontsource/slackey
```

`ClemDialogue.tsx` imports it. If you'd rather supply the face yourself, drop that import
and set `--clem-font`. Without either, he falls back to a rounded system stack.

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
| `side` | `'left' \| 'right'` | `'left'` | Which corner he occupies. |
| `autoAdvanceMs` | `number \| null` | `null` | Auto-advance this long after a line lands. |
| `idleNudge` | `ClemIdleNudge \| null` | `null` | Have him pipe up after a quiet stretch. |
| `className` | `string` | — | Applied to the outermost element. |

### Messages

```ts
type ClemMood = 'idle' | 'curious' | 'excited' | 'sly' | 'surprised'

interface ClemMessage {
  id?: string
  text: string
  mood?: ClemMood                 // drives his brows and mouth
  action?: {
    label: string
    onClick?: () => void
    href?: string                 // renders a link instead of a button
  }
}
```

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
| `--clem-body` | `#ffd23f` | Mantle |
| `--clem-body-shade` | `#f0a81e` | Fins and tentacles |
| `--clem-ink` | `#16121f` | Outlines, brows, pupils |
| `--clem-accent` | `#ffd23f` | Name, chevron, caret |
| `--clem-text` | `#ffffff` | Message text |
| `--clem-panel` | `rgb(10 10 12 / 0.9)` | The slab |
| `--clem-panel-blur` | `3px` | Backdrop blur behind the slab |
| `--clem-font` | `'Slackey', …` | Typeface for the whole component |
| `--clem-z` | `9999` | Stacking order |
| `--clem-offset` | `clamp(0.75rem, 3vw, 2rem)` | Distance from the viewport edges |
| `--clem-size` | `182px` | Clem's height |
| `--clem-overlap` | `70px` | How much of him hides behind the panel |

The `className` prop lands on the element that declares them, so that's the hook:

```tsx
<ClemDialogue className="clem-mint" messages={lines} />
```

```css
/* A plain global stylesheet — the component's own class names are hashed by
   CSS Modules, so this is the stable way in. */
.clem-mint {
  --clem-body: #8ef0c4;
  --clem-body-shade: #4bc79a;
  --clem-accent: #8ef0c4;
  --clem-panel: rgb(18 8 30 / 0.92);
}
```

`--clem-overlap` is the one to be careful with: he's clipped at the panel's top edge, and
the default is tuned so the cut lands just above his tentacles. Lower it much and they
get sliced into a row of flat bars.

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

**Next.js (App Router)** — he uses state and effects, so he's a client component. Either
add `'use client'` at the top of `ClemDialogue.tsx` or import him from a file that has it.

**Vite / CRA** — nothing special; the quick start above is it.

---

## Accessibility

- **Not a modal.** No focus trap, no `aria-modal`, and he never steals focus on mount.
- The typewriter is `aria-hidden`; the *complete* line is announced once through a
  visually hidden `aria-live="polite"` region. Announcing the animated text directly would
  read it out one character at a time.
- Every control is a real `<button>` with a label, and `Escape` dismisses.
- `prefers-reduced-motion` is respected twice over — in the stylesheet, so it holds before
  hydration, and in JS, which skips the typewriter and the peek loop.
- Measured contrast over the worst case (the translucent panel on a white page):
  **15.8:1** for the message text, **10.9:1** for the name. Both clear WCAG AAA.

---

## Scripts

| | |
| --- | --- |
| `npm run dev` | Demo playground |
| `npm run build` | Typecheck and production build |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | ESLint |

---

## A note on the design

The layout takes its cue from game dialogue boxes generally — a bottom-anchored slab, a
named speaker, typewriter text. The specifics are original: no hazard-stripe tape, no
square portrait frame, no dotted-line name tag, original palette, original character.
Clem is his own squid.
