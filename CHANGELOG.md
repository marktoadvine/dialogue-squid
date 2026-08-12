# Changelog

All notable changes to this project are documented here.
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-08-12

Initial release.

### Added
- `ClemDialogue`, a bottom-anchored dialogue panel with typewriter text and a
  squid mascot perched on top.
- Five moods: `idle`, `curious`, `excited`, `sly`, `happy`. Expression comes
  from morphing the goggle mask
- Click, `Enter` and `Space` to skip typing or advance; `Escape` to dismiss.
- Idle nudge lines after a configurable delay.
- Full theming through CSS custom properties (`--clem-body`, `--clem-accent`,
  `--clem-panel`, and others).
- Respects `prefers-reduced-motion` in both CSS and JS.
- Ships as an installable package with TypeScript types and a `'use client'`
  banner for React Server Component setups.
