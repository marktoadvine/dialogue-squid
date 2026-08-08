import { useMemo, useState } from 'react'
import { ClemDialogue } from './components/ClemDialogue'
import { CLEM_LINES, NUDGE_LINES } from './demo/clemLines'
import styles from './App.module.css'

/**
 * Deliberately empty. The only thing on this page is the component itself —
 * no sample content to judge it against or distract from it. The one control
 * flips the backdrop, because a translucent panel has to be checked on both.
 */
export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  const idleNudge = useMemo(
    () => ({ after: 12000, messages: NUDGE_LINES, repeat: true }),
    [],
  )

  return (
    <div className={styles.app} data-theme={theme}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} background`}
      >
        {theme === 'dark' ? '☀' : '☾'}
      </button>

      <ClemDialogue messages={CLEM_LINES} idleNudge={idleNudge} />
    </div>
  )
}
