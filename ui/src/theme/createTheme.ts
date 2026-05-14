import { defaultTheme } from './defaults'
import type { PortalTheme, ThemeOverrides } from './types'

/**
 * Merge user overrides with the default theme.
 *
 * Only the fields provided in overrides are changed — every other field
 * falls back to the SDK default. No field is required.
 *
 * @example
 * // theme.config.ts
 * import { createTheme } from '@lucifer91299/ui'
 * export default createTheme({
 *   primary: '#E11D48',
 *   projectName: 'My Portal',
 *   sidebar: 'rail',
 * })
 */
export function createTheme(overrides: ThemeOverrides = {}): PortalTheme {
  return { ...defaultTheme, ...overrides }
}
