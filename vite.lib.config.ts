import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// The library build. `vite.config.ts` next door builds the demo page; the two
// write to different directories so they don't clobber each other.
export default defineConfig({
  plugins: [
    react(),
    dts({
      // The root tsconfig.json is a solution file with `files: []`, so
      // pointing at it emits nothing. Aim at the one that actually has
      // sources in scope.
      tsconfigPath: 'tsconfig.app.json',
      // vite-env.d.ts carries the ambient `*.module.css` declarations; without
      // it in scope the CSS imports fail to resolve during declaration emit.
      include: ['src/components/ClemDialogue', 'src/vite-env.d.ts'],
      entryRoot: 'src/components/ClemDialogue',
      insertTypesEntry: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: 'src/components/ClemDialogue/index.ts',
      formats: ['es'],
      fileName: () => 'dialogue-squid.js',
      cssFileName: 'dialogue-squid',
    },
    rollupOptions: {
      // Never bundle React — a second copy in the consumer's tree breaks hooks.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // Rollup strips module-level directives during bundling, so the
        // 'use client' on ClemDialogue.tsx would be lost. The whole bundle is
        // client-side, so re-adding it once at the top is correct.
        banner: "'use client';",
      },
    },
  },
})
