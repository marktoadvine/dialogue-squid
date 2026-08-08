import { useId } from 'react'
import type { ClemMood } from './types'
import styles from './Clem.module.css'

export interface ClemProps {
  mood?: ClemMood
  /** Lids and brows jitter while a line is being typed. */
  talking?: boolean
  /** Leans and scans the page during an idle stretch. */
  looking?: boolean
  /** Kills every looping animation. */
  stillness?: boolean
  className?: string
}

/**
 * Clem is built entirely from fills — there is not a single stroke on the
 * character. His whole face is one graphic: a black goggle, a white well
 * clipped inside it, two pupils, and a pair of lids that slide around within
 * the well. Every expression is those lids moving; there is no mouth.
 */
export function Clem({
  mood = 'idle',
  talking = false,
  looking = false,
  stillness = false,
  className,
}: ClemProps) {
  // useId emits colons, which are legal in an id but awkward in url(#…).
  const wellId = `clem-well-${useId().replace(/:/g, '')}`

  const rootClass = [
    styles.clem,
    looking ? styles.looking : '',
    talking ? styles.talking : '',
    stillness ? styles.still : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      className={rootClass}
      data-mood={mood}
      viewBox="0 0 120 140"
      role="img"
      aria-label="Clem, a cheerful yellow squid"
      focusable="false"
    >
      <defs>
        <clipPath id={wellId}>
          <path d="M60 43 C72 43 82 45 86 49 C90 53 90 59 86 63 C82 66 77 66 73 62 C69 59 65 57 60 57 C55 57 51 59 47 62 C43 66 38 66 34 63 C30 59 30 53 34 49 C38 45 48 43 60 43 Z" />
        </clipPath>
      </defs>

      <g className={styles.bob}>
        {/* Tentacles first — the mantle and nubs cover where they attach. */}
        <g className={styles.tentacles}>
          <path
            className={`${styles.tentacle} ${styles.t1}`}
            d="M35 86 C29 102 25 116 28 130 C29 136 37 136 38 130 C41 116 43 102 45 86 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t2}`}
            d="M55 88 C53 102 52 116 54 130 C55 136 63 136 64 130 C66 116 65 102 63 88 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t3}`}
            d="M85 86 C91 102 95 116 92 130 C91 136 83 136 82 130 C79 116 77 102 75 86 Z"
          />
        </g>

        {/* One arrowhead. The fins are part of the silhouette, not add-ons —
            they sweep out and down to points rather than bulging. */}
        <path
          className={styles.mantle}
          d="M60 8 C73 10 94 28 105 48 C110 56 113 66 111 70 C108 72 102 68 96 65 C92 63 90 62 87 61 C89 70 89 78 89 84 L31 84 C31 78 31 70 33 61 C30 62 28 63 24 65 C18 68 12 72 9 70 C7 66 10 56 15 48 C26 28 47 10 60 8 Z"
        />

        {/* The hem: small tentacle nubs poking below the mantle's bottom edge.
            Same fill as everything else — the gaps between them do the
            separating, since nothing here is outlined. */}
        <g className={styles.nubs}>
          <circle cx="37.5" cy="88" r="7.4" />
          <circle cx="52.5" cy="88" r="7.4" />
          <circle cx="67.5" cy="88" r="7.4" />
          <circle cx="82.5" cy="88" r="7.4" />
        </g>

        <g className={styles.face}>
          {/* The frame is deliberately heavy — a thin rim reads as spectacles,
              not as the graphic mask this design is after. */}
          <path
            className={styles.goggle}
            d="M60 34 C76 34 90 37 95 43 C100 49 100 62 94 68 C89 73 80 74 74 69 C69 65 65 63 60 63 C55 63 51 65 46 69 C40 74 31 73 26 68 C20 62 20 49 25 43 C30 37 44 34 60 34 Z"
          />

          <g clipPath={`url(#${wellId})`}>
            <rect className={styles.sclera} x="24" y="34" width="72" height="38" />

            <g className={styles.pupils}>
              <ellipse className={styles.pupil} cx="45" cy="52" rx="8" ry="7" />
              <ellipse className={styles.pupil} cx="75" cy="52" rx="8" ry="7" />
            </g>

            {/* Blinking moves this group; mood moves the lids inside it. Two
                levels so the two never fight over `transform`. The lids
                overlap at the centre so no seam shows between them. */}
            <g className={styles.lids}>
              <path
                className={styles.lidLeft}
                d="M16 4 H62 V40 C52 47 38 47 28 43 C24 41 19 41 16 42 Z"
              />
              <path
                className={styles.lidRight}
                d="M58 4 H104 V42 C101 41 96 41 92 43 C82 47 68 47 58 40 Z"
              />
            </g>
          </g>
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
    </svg>
  )
}
