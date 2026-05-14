import type { ReactNode } from 'react'

export interface NavItem {
  label: string
  href: string
  icon: ReactNode
  badge?: number
  /** Optional permission key — consumer filters these before passing navGroups */
  permission?: string
}

export interface NavGroup {
  heading: string
  groupIcon: ReactNode
  items: NavItem[]
}

export interface UserInfo {
  name: string
  role: string
  avatarSrc?: string
}

export interface PoweredByConfig {
  logoSrc: string
  text?: string
  href?: string
}
