import { defineConfig } from 'tsup'

export default defineConfig([
  {
    // Client bundle — components, hooks, theme
    entry: { index: 'src/index.ts' },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    treeshake: true,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'next', 'tailwindcss', 'framer-motion'],
  },
  {
    // Server bundle — middleware factories, route handlers (no "use client")
    entry: {
      server: 'src/server.ts',
      'tailwind/preset': 'src/tailwind/preset.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    treeshake: true,
    sourcemap: true,
    external: ['react', 'react-dom', 'next', 'tailwindcss', 'jose'],
  },
])
