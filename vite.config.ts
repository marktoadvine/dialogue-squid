import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The demo page. `vite.lib.config.ts` builds the publishable library and owns
// `dist/`, so the demo goes somewhere else.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-demo',
  },
})
