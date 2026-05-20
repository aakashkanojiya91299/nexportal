import type { ScaffoldOptions } from './types'

export function genNavConfig(o: ScaffoldOptions): string {
  switch (o.preset) {
    case 'ecom-header':
    case 'ecom-sidebar':
      return genEcomNav()
    case 'admin':
      return genAdminNav()
    case 'talent':
      return genTalentNav()
    default:
      return genBlankNav()
  }
}

function genEcomNav(): string {
  return `import {
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, Settings, BarChart2,
} from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Store',
    groupIcon: <ShoppingBag className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard',  href: '/dashboard',             icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Products',   href: '/dashboard/products',    icon: <ShoppingBag className="h-4 w-4" /> },
      { label: 'Orders',     href: '/dashboard/orders',      icon: <ShoppingCart className="h-4 w-4" /> },
      { label: 'Customers',  href: '/dashboard/customers',   icon: <Users className="h-4 w-4" /> },
      { label: 'Analytics',  href: '/dashboard/analytics',   icon: <BarChart2 className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <Settings className="h-3.5 w-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}

function genAdminNav(): string {
  return `import {
  LayoutDashboard, Users, Shield, FileText, Settings, Activity,
} from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Management',
    groupIcon: <Shield className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard', href: '/dashboard',           icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Users',     href: '/dashboard/users',     icon: <Users className="h-4 w-4" /> },
      { label: 'Roles',     href: '/dashboard/roles',     icon: <Shield className="h-4 w-4" /> },
      { label: 'Audit Log', href: '/dashboard/audit',     icon: <FileText className="h-4 w-4" /> },
      { label: 'Activity',  href: '/dashboard/activity',  icon: <Activity className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <Settings className="h-3.5 w-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}

function genTalentNav(): string {
  return `import {
  LayoutDashboard, UserCheck, ClipboardList, Award, Users, Settings,
} from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Talent',
    groupIcon: <UserCheck className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard',      href: '/dashboard',                  icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Athletes',       href: '/dashboard/athletes',         icon: <Users className="h-4 w-4" /> },
      { label: 'Registrations',  href: '/dashboard/registrations',    icon: <ClipboardList className="h-4 w-4" /> },
      { label: 'Certificates',   href: '/dashboard/certificates',     icon: <Award className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <Settings className="h-3.5 w-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}

function genBlankNav(): string {
  return `import { LayoutDashboard, Settings, Users, Layers, ClipboardList, FormInput } from 'lucide-react'
import type { NavGroup } from '@lucifer91299/ui'

export const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    groupIcon: <LayoutDashboard className="h-3.5 w-3.5" />,
    items: [
      { label: 'Dashboard',    href: '/dashboard',               icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: 'Users',        href: '/dashboard/users',         icon: <Users className="h-4 w-4" /> },
      { label: 'Form Builder', href: '/dashboard/form-builder',  icon: <FormInput className="h-4 w-4" /> },
      { label: 'Components',   href: '/dashboard/components',    icon: <Layers className="h-4 w-4" /> },
      { label: 'Onboarding',   href: '/dashboard/onboarding',    icon: <ClipboardList className="h-4 w-4" /> },
    ],
  },
  {
    heading: 'Account',
    groupIcon: <Settings className="h-3.5 w-3.5" />,
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ],
  },
]
`
}
