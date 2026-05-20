import type { ScaffoldOptions } from './types'

export function genRootPage(): string {
  return `import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
`
}

export function genRootLayout(o: ScaffoldOptions): string {
  return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@lucifer91299/ui/styles/components.css'
import './globals.css'
import { Providers } from '@/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '${o.projectName}',
  description: '${o.projectDescription}',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
`
}

export function genProviders(o: ScaffoldOptions): string {
  const imports = [
    `'use client'`,
    `import { type ReactNode } from 'react'`,
    `import { ThemeProvider } from '@lucifer91299/ui'`,
    `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'`,
    `import theme from '@/theme.config'`,
  ]
  const setup = [`const queryClient = new QueryClient()`]

  if (o.stateManagement === 'redux-query') {
    imports.push(`import { Provider as ReduxProvider } from 'react-redux'`)
    imports.push(`import { store } from '@/store'`)
  }

  const wrap = (inner: string) => {
    let r = inner
    r = `<QueryClientProvider client={queryClient}>${r}</QueryClientProvider>`
    if (o.stateManagement === 'redux-query') r = `<ReduxProvider store={store}>${r}</ReduxProvider>`
    return `<ThemeProvider theme={theme}>${r}</ThemeProvider>`
  }

  return `${imports.join('\n')}

${setup.join('\n')}

export function Providers({ children }: { children: ReactNode }) {
  return (
    ${wrap('{children}')}
  )
}
`
}

export function genSettingsPage(o: ScaffoldOptions): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, Breadcrumbs, Card, Input, Select, Button, AlertBanner } from '@lucifer91299/ui'

const SIDEBAR_OPTIONS = [
  { value: 'full',   label: 'Full — wide sidebar with labels' },
  { value: 'rail',   label: 'Rail — icon-only narrow sidebar' },
  { value: 'header', label: 'Header — horizontal top nav bar' },
]

export default function SettingsPage() {
  const [saved, setSaved]         = useState(false)
  const [projectName, setProject] = useState('${o.projectName}')
  const [sidebar, setSidebar]     = useState('${o.sidebarStyle}')
  const [apiUrl, setApiUrl]       = useState('${o.apiUrl ?? ''}')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <PageShell
        title="Settings"
        subtitle="Configure your portal appearance and connection settings."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Settings' }]} />}
        actions={<Button variant="primary" onClick={handleSave}>Save changes</Button>}
      />

      {saved && <AlertBanner variant="success">Settings saved successfully.</AlertBanner>}

      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Project name" value={projectName} onChange={e => setProject(e.target.value)} />
          <Select label="Sidebar style" options={SIDEBAR_OPTIONS} value={sidebar} onChange={setSidebar} />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Connection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Backend API URL"
            value={apiUrl}
            onChange={e => setApiUrl(e.target.value)}
            helperText="Used by the API client for all requests."
          />
          <Input
            label="JWT cookie name"
            defaultValue="${o.jwtCookieName ?? 'access_token'}"
            helperText="Must match the cookie set by your login route."
          />
        </div>
      </Card>
    </div>
  )
}
`
}

export function genGenericHomePage(): string {
  return `'use client'

import React from 'react'
import { PageShell, DataTable, StatusBadge, PortalBarChart, PortalDonutChart } from '@lucifer91299/ui'
import { TrendingUp, Users, ShoppingCart, Activity } from 'lucide-react'

const STATS = [
  { label: 'Total Users',  value: '2,847',   change: '+12%',  icon: Users,        bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Revenue',      value: '₹48,295', change: '+8.2%', icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
  { label: 'Orders',       value: '1,429',   change: '+5.1%', icon: ShoppingCart, bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Active Now',   value: '94',      change: '+3',    icon: Activity,     bg: 'bg-purple-50', fg: 'text-purple-600' },
]

const MONTHLY = [
  { month: 'Jan', orders: 38, revenue: 48 }, { month: 'Feb', orders: 52, revenue: 62 },
  { month: 'Mar', orders: 47, revenue: 55 }, { month: 'Apr', orders: 65, revenue: 78 },
  { month: 'May', orders: 71, revenue: 85 }, { month: 'Jun', orders: 60, revenue: 72 },
  { month: 'Jul', orders: 84, revenue: 96 }, { month: 'Aug', orders: 79, revenue: 92 },
]

const STATUS_DONUT = [
  { name: 'Completed', value: 384, color: '#138808' },
  { name: 'Approved',  value: 213, color: '#000080' },
  { name: 'Pending',   value: 97,  color: '#FF9933' },
  { name: 'Rejected',  value: 42,  color: '#ef4444' },
]

const ACTIVITY = [
  { id: 'ORD-001', user: 'Rahul Sharma',  action: 'New order placed',   time: '2 min ago',  status: 'pending'   },
  { id: 'ORD-002', user: 'Priya Mehta',   action: 'Payment received',   time: '14 min ago', status: 'paid'      },
  { id: 'ORD-003', user: 'Amit Patel',    action: 'Order approved',     time: '1 hr ago',   status: 'approved'  },
  { id: 'ORD-004', user: 'Sneha Iyer',    action: 'Account registered', time: '3 hr ago',   status: 'active'    },
  { id: 'ORD-005', user: 'Vikram Singh',  action: 'Order completed',    time: 'Yesterday',  status: 'completed' },
]

export default function DashboardHome() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell title="Dashboard" subtitle="Here's what's happening today." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, bg, fg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-separator">
            <div className="flex items-center justify-between mb-3">
              <p className="text-subhead text-label-secondary">{label}</p>
              <div className={\`w-9 h-9 rounded-xl flex items-center justify-center \${bg} \${fg}\`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-title1 font-bold text-label-primary">{value}</p>
            <p className="text-footnote text-green-600 mt-0.5 font-medium">{change} this month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-4">Monthly Overview</p>
          <PortalBarChart
            data={MONTHLY} xKey="month"
            series={[{ key: 'orders', name: 'Orders' }, { key: 'revenue', name: 'Revenue (₹K)' }]}
            height={220}
          />
        </div>
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-2">Status Breakdown</p>
          <PortalDonutChart data={STATUS_DONUT} height={230} centerValue="736" centerLabel="Total" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-5 py-4 border-b border-separator">
          <h2 className="text-callout font-semibold text-label-primary">Recent Activity</h2>
        </div>
        <DataTable
          columns={[
            { key: 'id',     header: 'ID',     render: r => <span className="font-mono text-xs text-label-tertiary">{r.id}</span> },
            { key: 'user',   header: 'User',   render: r => <span className="font-medium text-label-primary">{r.user}</span> },
            { key: 'action', header: 'Action', render: r => <span className="text-label-secondary">{r.action}</span> },
            { key: 'time',   header: 'Time',   render: r => <span className="text-label-tertiary">{r.time}</span> },
            { key: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
          ]}
          data={ACTIVITY}
          keyExtractor={r => r.id}
        />
      </div>
    </div>
  )
}
`
}
