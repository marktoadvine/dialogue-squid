import type { ClemMood } from './types'
import styles from './Clem.module.css'

interface MouthShape {
  d: string
  filled: boolean
}

/**
 * Clem's face is two lookup tables. Brows do most of the acting — they read at
 * small sizes in a way a mouth never does — so each mood mostly means "where
 * are the brows".
 */
const MOUTHS: Record<ClemMood, MouthShape> = {
  idle: { d: 'M68 112 Q80 122 92 112', filled: false },
  curious: {
    d: 'M80 106 C85 106 88 110 88 114 C88 119 85 122 80 122 C75 122 72 119 72 114 C72 110 75 106 80 106 Z',
    filled: true,
  },
  excited: { d: 'M65 107 C72 127 88 127 95 107 Z', filled: true },
  sly: { d: 'M67 117 Q80 117 94 106', filled: false },
  surprised: {
    d: 'M80 102 C87 102 92 108 92 114 C92 121 87 126 80 126 C73 126 68 121 68 114 C68 108 73 102 80 102 Z',
    filled: true,
  },
}

const BROWS: Record<ClemMood, { left: string; right: string }> = {
  idle: { left: 'M46 66 Q60 57 75 63', right: 'M114 66 Q100 57 85 63' },
  // One brow up, one level — the universal "hmm?"
  curious: { left: 'M46 61 Q60 48 75 57', right: 'M114 67 Q100 60 85 64' },
  excited: { left: 'M46 57 Q60 45 75 54', right: 'M114 57 Q100 45 85 54' },
  sly: { left: 'M46 59 Q60 54 75 66', right: 'M114 66 Q100 57 85 62' },
  surprised: { left: 'M45 53 Q60 41 76 51', right: 'M115 53 Q100 41 84 51' },
}

export interface ClemProps {
  mood?: ClemMood
  /** Mouth flaps and brows jitter while a line is being typed. */
  talking?: boolean
  /** Leans out from behind the panel to peer at the visitor. */
  peeking?: boolean
  /** Kills every looping animation. */
  stillness?: boolean
  className?: string
}

export function Clem({
  mood = 'idle',
  talking = false,
  peeking = false,
  stillness = false,
  className,
}: ClemProps) {
  const mouth = MOUTHS[mood]
  const brows = BROWS[mood]

  const rootClass = [
    styles.clem,
    peeking ? styles.peeking : '',
    talking ? styles.talking : '',
    stillness ? styles.still : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      className={rootClass}
      viewBox="0 0 160 190"
      role="img"
      aria-label="Clem, a cheerful yellow squid"
      focusable="false"
    >
      <g className={styles.bob}>
        {/* Tentacles first so the mantle's base overlaps where they attach. */}
        <g className={styles.tentacles}>
          <path
            className={`${styles.tentacle} ${styles.t1}`}
            d="M36 116 C30 134 26 150 28 166 C29 172 37 173 40 167 C46 152 48 132 50 118 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t2}`}
            d="M58 122 C54 142 52 158 54 174 C55 180 63 181 65 175 C69 158 70 140 72 122 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t3}`}
            d="M102 122 C106 142 108 158 106 174 C105 180 97 181 95 175 C91 158 90 140 88 122 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t4}`}
            d="M124 116 C130 134 134 150 132 166 C131 172 123 173 120 167 C114 152 112 132 110 118 Z"
          />
        </g>

        {/* Fins sit behind the mantle so their inner edges disappear under it.
            Swept back and down — small round ones read as ears, not fins. */}
        <path
          className={styles.fin}
          d="M48 40 C28 27 6 37 3 60 C22 72 41 62 52 52 Z"
        />
        <path
          className={styles.fin}
          d="M112 40 C132 27 154 37 157 60 C138 72 119 62 108 52 Z"
        />

        <g className={styles.mantle}>
          {/* A squid mantle is a cone, not a dome — the apex stays tight. */}
          <path
            className={styles.body}
            d="M80 4 C93 6 127 48 133 90 C137 116 111 131 80 131 C49 131 23 116 27 90 C33 48 67 6 80 4 Z"
          />
          <ellipse
            className={styles.gloss}
            cx="54"
            cy="40"
            rx="13"
            ry="8"
            transform="rotate(-38 54 40)"
          />
        </g>

        <g className={styles.face}>
          <g className={styles.brows}>
            <path className={styles.brow} d={brows.left} />
            <path className={styles.brow} d={brows.right} />
          </g>

          <g className={`${styles.eye} ${styles.eyeLeft}`}>
            <ellipse className={styles.sclera} cx="60" cy="86" rx="17" ry="19" />
            <ellipse className={styles.pupil} cx="63" cy="89" rx="8.5" ry="10" />
            <circle className={styles.glint} cx="66.5" cy="83.5" r="3.4" />
          </g>
          <g className={`${styles.eye} ${styles.eyeRight}`}>
            <ellipse className={styles.sclera} cx="100" cy="86" rx="17" ry="19" />
            <ellipse className={styles.pupil} cx="103" cy="89" rx="8.5" ry="10" />
            <circle className={styles.glint} cx="106.5" cy="83.5" r="3.4" />
          </g>

          {/* CSS beats presentation attributes, so fill is selected via the
              data attribute rather than a fill="none" attribute. */}
          <path
            className={styles.mouth}
            d={mouth.d}
            data-filled={mouth.filled ? 'true' : 'false'}
          />
        </g>
      </g>
    </svg>
  )
}

/** The ink blot that fires off behind Clem when he arrives. */
export function InkSplat({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 170"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M104 16 C134 4 156 26 164 52 C186 60 190 90 172 104 C176 130 150 148 124 138 C108 158 76 156 62 136 C34 142 14 120 22 96 C4 78 14 48 38 42 C50 18 80 8 104 16 Z" />
      <circle cx="184" cy="30" r="9" />
      <circle cx="22" cy="150" r="7" />
      <circle cx="168" cy="152" r="5" />
      <circle cx="8" cy="60" r="4.5" />
    </svg>
  )
}
