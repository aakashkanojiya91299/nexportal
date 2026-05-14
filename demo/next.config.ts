import type { NextConfig } from 'next'

const config: NextConfig = {
  // Allow file: dependency to be transpiled properly
  transpilePackages: ['@lucifer91299/ui'],
}

export default config
