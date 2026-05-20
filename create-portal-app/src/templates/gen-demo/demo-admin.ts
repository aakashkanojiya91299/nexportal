/** Admin panel demo pages — dashboard, users, roles, audit log */

export function genAdminHomePage(): string {
  return `'use client'

import React from 'react'
import { PageShell, DataTable, StatusBadge, PortalBarChart, PortalDonutChart } from '@lucifer91299/ui'
import { Users, Shield, FileText, Activity } from 'lucide-react'

const STATS = [
  { label: 'Total Users',       value: '3,481',  change: '+124', icon: Users,    bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Active Roles',      value: '6',       change: '+1',   icon: Shield,   bg: 'bg-purple-50', fg: 'text-purple-600' },
  { label: 'Audit Events Today',value: '218',     change: '+34',  icon: FileText, bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Online Now',        value: '47',      change: '+5',   icon: Activity, bg: 'bg-green-50',  fg: 'text-green-600'  },
]

const MONTHLY_SIGNUPS = [
  { month: 'Jan', users: 120 }, { month: 'Feb', users: 145 },
  { month: 'Mar', users: 138 }, { month: 'Apr', users: 172 },
  { month: 'May', users: 195 }, { month: 'Jun', users: 164 },
  { month: 'Jul', users: 221 }, { month: 'Aug', users: 208 },
]

const ROLE_DIST = [
  { name: 'Admin',   value: 12,   color: '#000080' },
  { name: 'Manager', value: 45,   color: '#FF9933' },
  { name: 'Editor',  value: 198,  color: '#138808' },
  { name: 'Viewer',  value: 3226, color: '#6b7280' },
]

const RECENT_EVENTS = [
  { id: 'EVT-001', user: 'aakash@example.com', action: 'User created',    resource: 'User #3481', time: '2 min ago',  level: 'info'    },
  { id: 'EVT-002', user: 'priya@example.com',  action: 'Role updated',    resource: 'Manager',    time: '14 min ago', level: 'warning' },
  { id: 'EVT-003', user: 'ravi@example.com',   action: 'Login attempt',   resource: 'Auth',       time: '32 min ago', level: 'error'   },
  { id: 'EVT-004', user: 'sneha@example.com',  action: 'Password changed',resource: 'User #3479', time: '1 hr ago',   level: 'success' },
  { id: 'EVT-005', user: 'vikram@example.com', action: 'User deleted',    resource: 'User #3401', time: '3 hr ago',   level: 'warning' },
]

export default function AdminDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell title="Admin Dashboard" subtitle="System overview and recent activity." />

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
          <p className="text-headline font-semibold text-label-primary mb-1">Monthly Signups</p>
          <p className="text-footnote text-label-tertiary mb-4">New user registrations per month</p>
          <PortalBarChart data={MONTHLY_SIGNUPS} xKey="month" series={[{ key: 'users', name: 'Users' }]} height={220} />
        </div>
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-1">Role Distribution</p>
          <p className="text-footnote text-label-tertiary mb-2">Users by role</p>
          <PortalDonutChart data={ROLE_DIST} height={230} centerValue="3,481" centerLabel="Users" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-5 py-4 border-b border-separator">
          <h2 className="text-callout font-semibold text-label-primary">Recent Audit Events</h2>
        </div>
        <DataTable
          columns={[
            { key: 'id',       header: 'ID',       render: r => <span className="font-mono text-xs text-label-tertiary">{r.id}</span> },
            { key: 'user',     header: 'User',     render: r => <span className="text-label-secondary text-sm">{r.user}</span> },
            { key: 'action',   header: 'Action',   render: r => <span className="font-medium text-label-primary">{r.action}</span> },
            { key: 'resource', header: 'Resource', render: r => <span className="text-label-secondary">{r.resource}</span> },
            { key: 'time',     header: 'Time',     render: r => <span className="text-label-tertiary text-sm">{r.time}</span> },
            { key: 'level',    header: 'Level',    render: r => <StatusBadge status={r.level} /> },
          ]}
          data={RECENT_EVENTS}
          keyExtractor={r => r.id}
        />
      </div>
    </div>
  )
}
`
}

export function genAdminUsersPage(): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, DataTable, StatusBadge, ActionButtons, Button, Input, Select } from '@lucifer91299/ui'
import { UserPlus, Search } from 'lucide-react'

type User = { id: number; name: string; email: string; role: string; status: string; lastLogin: string }

const USERS: User[] = [
  { id: 1,  name: 'Aakash Kanojiya',  email: 'aakash@example.com',  role: 'Admin',   status: 'active',   lastLogin: '20 May 2025' },
  { id: 2,  name: 'Priya Mehta',      email: 'priya@example.com',   role: 'Manager', status: 'active',   lastLogin: '19 May 2025' },
  { id: 3,  name: 'Ravi Kumar',       email: 'ravi@example.com',    role: 'Editor',  status: 'active',   lastLogin: '18 May 2025' },
  { id: 4,  name: 'Sneha Iyer',       email: 'sneha@example.com',   role: 'Viewer',  status: 'active',   lastLogin: '17 May 2025' },
  { id: 5,  name: 'Vikram Singh',     email: 'vikram@example.com',  role: 'Manager', status: 'inactive', lastLogin: '10 May 2025' },
  { id: 6,  name: 'Anjali Gupta',     email: 'anjali@example.com',  role: 'Editor',  status: 'active',   lastLogin: '20 May 2025' },
  { id: 7,  name: 'Karan Malhotra',   email: 'karan@example.com',   role: 'Viewer',  status: 'pending',  lastLogin: 'Never'       },
  { id: 8,  name: 'Divya Reddy',      email: 'divya@example.com',   role: 'Editor',  status: 'active',   lastLogin: '19 May 2025' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active',   label: 'Active'   },
  { value: 'pending',  label: 'Pending'  },
  { value: 'inactive', label: 'Inactive' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Admin',   label: 'Admin'   },
  { value: 'Manager', label: 'Manager' },
  { value: 'Editor',  label: 'Editor'  },
  { value: 'Viewer',  label: 'Viewer'  },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [role, setRole]     = useState('')

  const filtered = USERS.filter(u => {
    const q = search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (status && u.status !== status) return false
    if (role   && u.role   !== role)   return false
    return true
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell
        title="Users"
        subtitle={\`\${filtered.length} of \${USERS.length} users\`}
        actions={<Button variant="primary"><UserPlus className="w-4 h-4 mr-1.5" />Add User</Button>}
        controls={
          <>
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} suffix={<Search className="w-4 h-4" />} />
            </div>
            <div className="w-40"><Select options={STATUS_OPTIONS} value={status} onChange={setStatus} placeholder="Status" /></div>
            <div className="w-36"><Select options={ROLE_OPTIONS}  value={role}   onChange={setRole}   placeholder="Role"   /></div>
          </>
        }
      />
      <div className="bg-white rounded-2xl border border-separator shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: 'id',        header: '#',         render: (_, i) => <span className="text-label-tertiary text-footnote">{i + 1}</span>, className: 'w-10' },
            { key: 'name',      header: 'Name',      render: u => <div><p className="font-medium text-label-primary">{u.name}</p><p className="text-footnote text-label-tertiary">{u.email}</p></div> },
            { key: 'role',      header: 'Role' },
            { key: 'lastLogin', header: 'Last Login', render: u => <span className="text-label-tertiary text-sm">{u.lastLogin}</span> },
            { key: 'status',    header: 'Status',    render: u => <StatusBadge status={u.status} /> },
            { key: 'actions',   header: '',          className: 'w-24', render: () => <ActionButtons showView showEdit showDelete onView={() => {}} onEdit={() => {}} onDelete={() => {}} /> },
          ]}
          data={filtered}
          keyExtractor={u => u.id}
          emptyMessage="No users match your filters."
        />
      </div>
    </div>
  )
}
`
}
