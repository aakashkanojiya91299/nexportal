'use client'

import { useState } from 'react'
import {
  PageShell, Breadcrumbs, DataTable, StatusBadge, ActionButtons,
  Button, Input, Select, Badge,
} from '@lucifer91299/ui'
import { UserPlus, Search, Filter } from 'lucide-react'

type User = {
  id:         number
  name:       string
  email:      string
  role:       string
  state:      string
  status:     string
  joinedDate: string
}

const USERS: User[] = [
  { id: 1,  name: 'Ravi Sharma',    email: 'ravi@demo.com',    role: 'Admin',   state: 'Maharashtra', status: 'active',    joinedDate: '12 Jan 2024' },
  { id: 2,  name: 'Priya Mehta',    email: 'priya@demo.com',   role: 'Member',  state: 'Gujarat',     status: 'active',    joinedDate: '03 Feb 2024' },
  { id: 3,  name: 'Arjun Patel',    email: 'arjun@demo.com',   role: 'Coach',   state: 'Rajasthan',   status: 'pending',   joinedDate: '19 Mar 2024' },
  { id: 4,  name: 'Sunita Rao',     email: 'sunita@demo.com',  role: 'Judge',   state: 'Karnataka',   status: 'active',    joinedDate: '07 Apr 2024' },
  { id: 5,  name: 'Vikram Desai',   email: 'vikram@demo.com',  role: 'Member',  state: 'Tamil Nadu',  status: 'inactive',  joinedDate: '22 May 2024' },
  { id: 6,  name: 'Anjali Singh',   email: 'anjali@demo.com',  role: 'Member',  state: 'Delhi',       status: 'active',    joinedDate: '14 Jun 2024' },
  { id: 7,  name: 'Kiran Kumar',    email: 'kiran@demo.com',   role: 'Coach',   state: 'Punjab',      status: 'pending',   joinedDate: '01 Jul 2024' },
  { id: 8,  name: 'Deepak Joshi',   email: 'deepak@demo.com',  role: 'Member',  state: 'UP',          status: 'rejected',  joinedDate: '18 Aug 2024' },
]

const STATE_OPTIONS = [
  { value: '', label: 'All States' },
  { value: 'Maharashtra', label: 'Maharashtra' },
  { value: 'Gujarat', label: 'Gujarat' },
  { value: 'Rajasthan', label: 'Rajasthan' },
  { value: 'Karnataka', label: 'Karnataka' },
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Punjab', label: 'Punjab' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'Tamil Nadu', label: 'Tamil Nadu' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'rejected', label: 'Rejected' },
]

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Member', label: 'Member' },
  { value: 'Coach', label: 'Coach' },
  { value: 'Judge', label: 'Judge' },
]

export default function UsersPage() {
  const [search, setSearch]       = useState('')
  const [stateFilter, setState]   = useState('')
  const [statusFilter, setStatus] = useState('')
  const [roleFilter, setRole]     = useState('')

  const filtered = USERS.filter((u) => {
    const q = search.toLowerCase()
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
    if (stateFilter  && u.state  !== stateFilter)  return false
    if (statusFilter && u.status !== statusFilter) return false
    if (roleFilter   && u.role   !== roleFilter)   return false
    return true
  })

  const columns = [
    {
      key: 'id', header: '#',
      render: (_: User, i: number) => (
        <span className="text-label-tertiary text-footnote">{i + 1}</span>
      ),
      className: 'w-10',
    },
    {
      key: 'name', header: 'Name',
      render: (u: User) => (
        <div>
          <p className="font-medium text-label-primary">{u.name}</p>
          <p className="text-footnote text-label-tertiary">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'role', header: 'Role',
      render: (u: User) => <Badge variant="primary">{u.role}</Badge>,
    },
    { key: 'state', header: 'State' },
    {
      key: 'status', header: 'Status',
      render: (u: User) => <StatusBadge status={u.status} />,
    },
    { key: 'joinedDate', header: 'Joined' },
    {
      key: 'actions', header: '',
      className: 'w-28',
      render: () => (
        <ActionButtons
          showView showEdit showDelete
          onView={() => alert('View user')}
          onEdit={() => alert('Edit user')}
          onDelete={() => alert('Delete user')}
        />
      ),
    },
  ]

  return (
    <div className="p-6">
      <PageShell
        title="Users"
        subtitle={`${filtered.length} of ${USERS.length} users`}
        breadcrumbs={
          <Breadcrumbs items={[{ label: 'Users' }]} />
        }
        actions={
          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add User
          </Button>
        }
        controls={
          <>
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                suffix={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-44">
              <Select options={STATE_OPTIONS}  value={stateFilter}  onChange={setState}  placeholder="State"  searchable />
            </div>
            <div className="w-40">
              <Select options={STATUS_OPTIONS} value={statusFilter} onChange={setStatus} placeholder="Status" />
            </div>
            <div className="w-36">
              <Select options={ROLE_OPTIONS}   value={roleFilter}   onChange={setRole}   placeholder="Role" />
            </div>
            {(search || stateFilter || statusFilter || roleFilter) && (
              <Button variant="ghost" onClick={() => { setSearch(''); setState(''); setStatus(''); setRole('') }}>
                <Filter className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </>
        }
      />

      <div className="bg-white rounded-xl border border-separator shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(u) => u.id}
          emptyMessage="No users match your search."
        />
      </div>
    </div>
  )
}
