import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The demo page. `vite.lib.config.ts` builds the publishable library and owns
// `dist/`, so the demo goes somewhere else.
export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the build works from any subpath. GitHub Pages
  // serves this from /dialogue-squid/, and hardcoding that would break both
  // local dev and any future rename of the repo. This is an intentionsl exception.
  base: './',
  build: {
    outDir: 'dist-demo',
  },
})
