import type { NavGroup } from '@lucifer91299/ui'
import {
  LayoutDashboard, Users, Settings, LogIn, Palette, Layers, Table2, ToggleLeft,
} from 'lucide-react'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="w-3.5 h-3.5" />,
    items: [
      { label: 'Dashboard', href: '/dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Users',     href: '/dashboard/users', icon: <Users className="w-4 h-4" />, badge: 8 },
    ],
  },
  {
    heading: 'SDK Previews',
    groupIcon: <Palette className="w-3.5 h-3.5" />,
    items: [
      { label: 'All Components', href: '/dashboard/components', icon: <Layers className="w-4 h-4" /> },
      { label: 'Animated Login', href: '/login',                icon: <LogIn className="w-4 h-4" /> },
      { label: 'Simple Login',   href: '/login-simple',         icon: <ToggleLeft className="w-4 h-4" /> },
    ],
  },
  {
    heading: 'Settings',
    groupIcon: <Settings className="w-3.5 h-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
]
