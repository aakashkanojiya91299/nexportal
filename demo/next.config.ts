import type { NextConfig } from 'next'

const config: NextConfig = {
  // Allow file: dependency to be transpiled properly
  transpilePackages: ['@nexportal/ui'],
}

export default config
