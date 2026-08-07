import { useMemo, useState } from 'react'
import { ClemDialogue } from './components/ClemDialogue'
import type { ClemMessage } from './components/ClemDialogue'
import {
  ABOUT_LINES,
  HOME_LINES,
  NUDGE_LINES,
  PROJECTS_LINES,
} from './demo/clemLines'
import styles from './App.module.css'

type Route = 'home' | 'about' | 'projects'
type Backdrop = 'dark' | 'light' | 'busy'

const ROUTES: Array<{ id: Route; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
]

const LINES_BY_ROUTE: Record<Route, ClemMessage[]> = {
  home: HOME_LINES,
  about: ABOUT_LINES,
  projects: PROJECTS_LINES,
}

const PAGE_COPY: Record<Route, { title: string; body: string }> = {
  home: {
    title: 'Mark Toadvine',
    body: 'Designer and builder of small, loud interfaces. This page is a stand-in so Clem has somewhere to point.',
  },
  about: {
    title: 'About',
    body: 'You clicked the thing Clem told you to click. He noticed, and he has opinions about it.',
  },
  projects: {
    title: 'Projects',
    body: 'A shelf of things that mostly work. Clem is the newest one, and by far the chattiest.',
  },
}

export default function App() {
  const [route, setRoute] = useState<Route>('home')
  const [side, setSide] = useState<'left' | 'right'>('left')
  const [typeSpeed, setTypeSpeed] = useState(28)
  const [appearDelayMs, setAppearDelayMs] = useState(2500)
  const [backdrop, setBackdrop] = useState<Backdrop>('dark')
  const [clemOpen, setClemOpen] = useState(true)
  const [replayKey, setReplayKey] = useState(0)

  const messages = useMemo(() => LINES_BY_ROUTE[route], [route])
  const idleNudge = useMemo(
    () => ({ after: 12000, messages: NUDGE_LINES, repeat: true }),
    [],
  )

  const visit = (next: Route) => {
    setRoute(next)
    // Clem pipes up again on navigation even if he'd been dismissed.
    setClemOpen(true)
  }

  const page = PAGE_COPY[route]

  return (
    <div className={styles.app} data-backdrop={backdrop}>
      <div className={styles.site}>
        <nav className={styles.nav}>
          <span className={styles.brand}>◆ toadvine</span>
          <ul className={styles.navList}>
            {ROUTES.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={styles.navLink}
                  data-active={route === item.id ? 'true' : 'false'}
                  onClick={() => visit(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className={styles.page}>
          <h1 className={styles.title}>{page.title}</h1>
          <p className={styles.body}>{page.body}</p>
          <div className={styles.cards}>
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className={styles.card} />
            ))}
          </div>
        </main>
      </div>

      <aside className={styles.controls}>
        <h2 className={styles.controlsTitle}>Clem controls</h2>

        <label className={styles.field}>
          <span>Side</span>
          <div className={styles.segmented}>
            {(['left', 'right'] as const).map((value) => (
              <button
                key={value}
                type="button"
                data-active={side === value ? 'true' : 'false'}
                onClick={() => setSide(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </label>

        <label className={styles.field}>
          <span>Backdrop</span>
          <div className={styles.segmented}>
            {(['dark', 'light', 'busy'] as const).map((value) => (
              <button
                key={value}
                type="button"
                data-active={backdrop === value ? 'true' : 'false'}
                onClick={() => setBackdrop(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </label>

        <label className={styles.field}>
          <span>
            Type speed <em>{typeSpeed}ms/char</em>
          </span>
          <input
            type="range"
            min={4}
            max={90}
            step={2}
            value={typeSpeed}
            onChange={(event) => setTypeSpeed(Number(event.target.value))}
          />
        </label>

        <label className={styles.field}>
          <span>
            Appear delay <em>{(appearDelayMs / 1000).toFixed(1)}s</em>
          </span>
          <input
            type="range"
            min={0}
            max={6000}
            step={250}
            value={appearDelayMs}
            onChange={(event) => setAppearDelayMs(Number(event.target.value))}
          />
        </label>

        <button
          type="button"
          className={styles.replay}
          onClick={() => {
            setClemOpen(true)
            // Remounting is what lets the delayed entrance be watched again
            // without reloading the page.
            setReplayKey((key) => key + 1)
          }}
        >
          Replay entrance
        </button>

        <p className={styles.hint}>
          Click the panel to advance. Esc dismisses. Leave the page alone for 12
          seconds and Clem nudges you.
        </p>
      </aside>

      <ClemDialogue
        key={replayKey}
        messages={messages}
        open={clemOpen}
        onOpenChange={setClemOpen}
        side={side}
        typeSpeed={typeSpeed}
        appearDelayMs={appearDelayMs}
        idleNudge={idleNudge}
      />
    </div>
  )
}
