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
 * The mask shapes, per mood, kept here as well as in the stylesheet.
 *
 * These are set as the `d` *attribute* so the correct shape renders in every
 * browser. `Clem.module.css` sets the same paths via the CSS `d` property with
 * a transition, and CSS performs before a presentation attribute, so engines that
 * support it morph smoothly and the rest snap to the right shape. In our case, Safari 26.5 is a culprit.
 *
 * The two copies must stay in sync. `npm run check:masks` checks it.
 */
const MASKS: Record<ClemMood, { goggle: string; well: string }> = {
  idle: {
    goggle:
      'M60 34 C76 34 90 37 95 43 C100 49 100 62 94 68 C89 73 80 74 74 69 C69 65 65 63 60 63 C55 63 51 65 46 69 C40 74 31 73 26 68 C20 62 20 49 25 43 C30 37 44 34 60 34 Z',
    well:
      'M60 43 C72 43 82 45 86 49 C90 53 90 59 86 63 C82 66 77 66 73 62 C69 59 65 57 60 57 C55 57 51 59 47 62 C43 66 38 66 34 63 C30 59 30 53 34 49 C38 45 48 43 60 43 Z',
  },
  curious: {
    goggle:
      'M60 33 C76 35 90 39 95 45 C100 51 100 63 94 68 C89 73 80 74 74 69 C69 65 65 63 60 63 C55 63 51 65 46 69 C40 74 31 73 26 68 C19 62 19 46 23 38 C29 31 44 30 60 33 Z',
    well:
      'M60 43 C72 44 82 47 86 51 C90 55 90 60 86 63 C82 66 77 66 73 62 C69 59 65 57 60 57 C55 57 51 59 47 62 C43 66 37 66 33 62 C28 58 28 47 32 43 C37 39 48 41 60 43 Z',
  },
  excited: {
    goggle:
      'M60 31 C77 31 91 35 96 42 C101 49 101 63 95 70 C90 76 80 76 74 70 C69 66 65 64 60 64 C55 64 51 66 46 70 C40 76 30 76 25 70 C19 63 19 49 24 42 C29 35 43 31 60 31 Z',
    well:
      'M60 40 C73 40 83 43 87 48 C91 53 91 60 87 64 C83 68 77 68 73 63 C69 59 65 58 60 58 C55 58 51 59 47 63 C43 68 37 68 33 64 C29 60 29 53 33 48 C37 43 47 40 60 40 Z',
  },
  sly: {
    goggle:
      'M60 38 C76 38 90 40 95 45 C100 50 100 61 94 67 C89 72 80 73 74 68 C69 64 65 62 60 62 C55 62 51 64 46 68 C40 73 31 72 26 67 C20 61 20 50 25 45 C30 40 44 38 60 38 Z',
    well:
      'M60 50 C71 50 80 51 84 54 C88 57 88 60 84 63 C80 66 76 66 72 62 C68 59 65 58 60 58 C55 58 52 59 48 62 C44 66 40 66 36 63 C32 60 32 57 36 54 C40 51 49 50 60 50 Z',
  },
  happy: {
    goggle:
      'M60 36 C76 36 90 39 95 44 C100 50 100 62 94 68 C89 73 80 74 74 69 C69 65 65 63 60 63 C55 63 51 65 46 69 C40 74 31 73 26 68 C20 62 20 50 25 44 C30 39 44 36 60 36 Z',
    well:
      'M60 57 C66 48 80 48 86 56 C88 57 88 60 86 61 C82 61 78 57 74 54 C70 52 64 57 60 58 C56 57 50 52 46 54 C42 57 38 61 34 61 C32 60 32 57 34 56 C40 48 54 48 60 57 Z',
  },
}

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
        {/* The `d` attribute carries the mood shape so it is correct even
            where CSS `d` is unsupported. CSS adds the morph on top. yay. */}
        <clipPath id={wellId}>
          <path className={styles.well} d={MASKS[mood].well} />
        </clipPath>

      </defs>

      <g className={styles.bob}>
        {/* Tentacles first. The mantle and nubs cover where they attach.
            Each one descends, then bends outward and flattens where it meets
            the panel, with a wider tip: a limb taking weight spreads, and one
            that tapers to a point reads as floating. */}
        <g className={styles.tentacles}>
          <path
            className={`${styles.tentacle} ${styles.t1}`}
            d="M35 86 C31 100 25 111 17 119 C11 125 15 133 24 132 C32 131 38 117 42 103 C44 95 45 90 45 86 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t2}`}
            d="M55 88 C54 101 53 113 56 123 C58 130 67 132 70 126 C72 120 67 108 65 97 C64 92 64 90 64 88 Z"
          />
          <path
            className={`${styles.tentacle} ${styles.t3}`}
            d="M85 86 C89 100 95 111 103 119 C109 125 105 133 96 132 C88 131 82 117 78 103 C76 95 75 90 75 86 Z"
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
          {/* The frame is deliberately heavy. A thin rim reads as spectacles,
              not as the graphic mask this design is after. */}
          <path className={styles.goggle} d={MASKS[mood].goggle} />

          <g clipPath={`url(#${wellId})`}>
            <rect className={styles.sclera} x="24" y="34" width="72" height="38" />

            <g className={styles.pupils}>
              <ellipse className={styles.pupil} cx="45" cy="52" rx="8" ry="7" />
              <ellipse className={styles.pupil} cx="75" cy="52" rx="8" ry="7" />
            </g>

            {/* Blinking only. Mood is carried by the mask shapes themselves,
                so a single lid is enough. */}
            <path
              className={styles.lid}
              d="M12 -4 H108 V34 C88 42 32 42 12 34 Z"
            />
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
