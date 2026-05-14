import { defineConfig } from 'tsup'

export default defineConfig({
  entry: { index: 'src/cli/index.ts' },
  outDir: 'dist/cli',
  format: ['cjs'],
  splitting: false,
  clean: true,
  banner: { js: '#!/usr/bin/env node' },
})
