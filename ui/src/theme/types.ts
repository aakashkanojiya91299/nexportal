export type SidebarVariant = 'full' | 'rail' | 'header'
export type LoginStyle = 'animated' | 'simple'
export type BorderRadiusPreset = 'apple' | 'rounded' | 'sharp'

export interface PortalTheme {
  primary:             string
  'primary-soft':      string
  'primary-hover':     string
  accent:              string
  'accent-soft':       string
  'accent-hover':      string
  success:             string
  'success-soft':      string
  'success-hover':     string
  logoSrc:             string
  logoAlt:             string
  poweredByLogoSrc:    string
  poweredByText:       string
  poweredByHref:       string
  projectName:         string
  projectSubtitle:     string
  sidebar:             SidebarVariant
  loginStyle:          LoginStyle
  fontFamily:          string
  borderRadius:        BorderRadiusPreset
}

export type ThemeOverrides = Partial<PortalTheme>
