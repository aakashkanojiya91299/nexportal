import type { Config } from 'tailwindcss'
import preset from '@lucifer91299/ui/tailwind/preset'
import { join } from 'path'

const config: Config = {
  presets: [preset],
  content: [
    './src/**/*.{ts,tsx}',
    join(__dirname, '../ui/dist/index.js'),
  ],
}

export default config
