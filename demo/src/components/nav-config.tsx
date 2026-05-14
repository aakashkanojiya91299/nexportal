import type { NavGroup } from '@lucifer91299/ui'
import {
  LayoutDashboard, Users, Settings, LogIn, Palette, Layers,
} from 'lucide-react'

export const navGroups: NavGroup[] = [
  {
    heading: 'Demo',
    groupIcon: <LayoutDashboard className="w-3.5 h-3.5" />,
    items: [
      { label: 'Dashboard',        href: '/dashboard',      icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Users',            href: '/dashboard/users', icon: <Users className="w-4 h-4" />, badge: 3 },
    ],
  },
  {
    heading: 'SDK Previews',
    groupIcon: <Palette className="w-3.5 h-3.5" />,
    items: [
      { label: 'Animated Login',   href: '/login',          icon: <LogIn className="w-4 h-4" /> },
      { label: 'Simple Login',     href: '/login-simple',   icon: <LogIn className="w-4 h-4" /> },
      { label: 'Components',       href: '/dashboard/components', icon: <Layers className="w-4 h-4" /> },
    ],
  },
  {
    heading: 'Settings',
    groupIcon: <Settings className="w-3.5 h-3.5" />,
    items: [
      { label: 'Settings',         href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
]
