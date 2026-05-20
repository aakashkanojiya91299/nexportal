/** Talent portal demo pages — dashboard, athletes, registrations, certificates */

export function genTalentHomePage(): string {
  return `'use client'

import React from 'react'
import { PageShell, DataTable, StatusBadge, PortalBarChart, PortalDonutChart } from '@lucifer91299/ui'
import { Users, ClipboardList, Award, TrendingUp } from 'lucide-react'

const STATS = [
  { label: 'Total Athletes',    value: '2,847', change: '+124', icon: Users,          bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Registrations',     value: '1,204', change: '+48',  icon: ClipboardList,  bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Certs Issued',      value: '894',   change: '+32',  icon: Award,          bg: 'bg-green-50',  fg: 'text-green-600'  },
  { label: 'Approval Rate',     value: '87%',   change: '+2%',  icon: TrendingUp,     bg: 'bg-purple-50', fg: 'text-purple-600' },
]

const MONTHLY = [
  { month: 'Jan', registrations: 85,  certs: 62 },
  { month: 'Feb', registrations: 102, certs: 84 },
  { month: 'Mar', registrations: 96,  certs: 78 },
  { month: 'Apr', registrations: 124, certs: 105 },
  { month: 'May', registrations: 138, certs: 112 },
  { month: 'Jun', registrations: 118, certs: 96 },
  { month: 'Jul', registrations: 155, certs: 128 },
  { month: 'Aug', registrations: 142, certs: 119 },
]

const REG_STATUS = [
  { name: 'Approved',   value: 894, color: '#138808' },
  { name: 'Pending',    value: 186, color: '#FF9933' },
  { name: 'Rejected',   value: 82,  color: '#ef4444' },
  { name: 'Under Review',value: 42, color: '#000080' },
]

const RECENT = [
  { id: 'ATH-0847', name: 'Arjun Verma',    sport: 'Athletics',    event: '100m Sprint',   status: 'approved'     },
  { id: 'ATH-0846', name: 'Kavya Sharma',   sport: 'Swimming',     event: '200m Freestyle',status: 'pending'      },
  { id: 'ATH-0845', name: 'Rohit Desai',    sport: 'Weightlifting',event: '73kg Category', status: 'under_review' },
  { id: 'ATH-0844', name: 'Pooja Nair',     sport: 'Gymnastics',   event: 'Floor Exercise',status: 'approved'     },
  { id: 'ATH-0843', name: 'Manish Tiwari',  sport: 'Boxing',       event: '69kg Category', status: 'rejected'     },
]

export default function TalentDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell title="Talent Dashboard" subtitle="Overview of athlete registrations and certifications." />

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
          <p className="text-headline font-semibold text-label-primary mb-1">Registrations &amp; Certificates</p>
          <p className="text-footnote text-label-tertiary mb-4">Monthly overview</p>
          <PortalBarChart
            data={MONTHLY} xKey="month"
            series={[{ key: 'registrations', name: 'Registrations' }, { key: 'certs', name: 'Certs Issued' }]}
            height={220}
          />
        </div>
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-1">Registration Status</p>
          <p className="text-footnote text-label-tertiary mb-2">All registrations</p>
          <PortalDonutChart data={REG_STATUS} height={230} centerValue="1,204" centerLabel="Total" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-5 py-4 border-b border-separator">
          <h2 className="text-callout font-semibold text-label-primary">Recent Registrations</h2>
        </div>
        <DataTable
          columns={[
            { key: 'id',     header: 'ID',     render: r => <span className="font-mono text-xs text-label-tertiary">{r.id}</span> },
            { key: 'name',   header: 'Athlete', render: r => <span className="font-medium text-label-primary">{r.name}</span> },
            { key: 'sport',  header: 'Sport',   render: r => <span className="text-label-secondary">{r.sport}</span> },
            { key: 'event',  header: 'Event',   render: r => <span className="text-label-secondary text-sm">{r.event}</span> },
            { key: 'status', header: 'Status',  render: r => <StatusBadge status={r.status} /> },
          ]}
          data={RECENT}
          keyExtractor={r => r.id}
        />
      </div>
    </div>
  )
}
`
}

export function genTalentAthletesPage(): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, DataTable, StatusBadge, ActionButtons, Button, Input, Select } from '@lucifer91299/ui'
import { UserPlus, Search } from 'lucide-react'

type Athlete = { id: string; name: string; sport: string; state: string; age: number; status: string; registered: string }

const ATHLETES: Athlete[] = [
  { id: 'ATH-0847', name: 'Arjun Verma',    sport: 'Athletics',     state: 'Maharashtra', age: 22, status: 'approved',  registered: '12 Jan 2025' },
  { id: 'ATH-0846', name: 'Kavya Sharma',   sport: 'Swimming',      state: 'Karnataka',   age: 19, status: 'pending',   registered: '18 Jan 2025' },
  { id: 'ATH-0845', name: 'Rohit Desai',    sport: 'Weightlifting', state: 'Gujarat',     age: 25, status: 'approved',  registered: '03 Feb 2025' },
  { id: 'ATH-0844', name: 'Pooja Nair',     sport: 'Gymnastics',    state: 'Kerala',      age: 18, status: 'approved',  registered: '07 Feb 2025' },
  { id: 'ATH-0843', name: 'Manish Tiwari',  sport: 'Boxing',        state: 'UP',          age: 24, status: 'rejected',  registered: '14 Feb 2025' },
  { id: 'ATH-0842', name: 'Simran Kaur',    sport: 'Wrestling',     state: 'Punjab',      age: 21, status: 'approved',  registered: '22 Feb 2025' },
  { id: 'ATH-0841', name: 'Dev Prakash',    sport: 'Athletics',     state: 'Bihar',       age: 23, status: 'pending',   registered: '01 Mar 2025' },
  { id: 'ATH-0840', name: 'Aarav Shah',     sport: 'Badminton',     state: 'Gujarat',     age: 20, status: 'approved',  registered: '10 Mar 2025' },
]

const SPORT_OPTIONS = [
  { value: '', label: 'All Sports' },
  { value: 'Athletics',     label: 'Athletics'     },
  { value: 'Swimming',      label: 'Swimming'      },
  { value: 'Weightlifting', label: 'Weightlifting' },
  { value: 'Gymnastics',    label: 'Gymnastics'    },
  { value: 'Boxing',        label: 'Boxing'        },
  { value: 'Wrestling',     label: 'Wrestling'     },
  { value: 'Badminton',     label: 'Badminton'     },
]

export default function AthletesPage() {
  const [search, setSearch] = useState('')
  const [sport, setSport]   = useState('')

  const filtered = ATHLETES.filter(a => {
    const q = search.toLowerCase()
    if (q && !a.name.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q)) return false
    if (sport && a.sport !== sport) return false
    return true
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell
        title="Athletes"
        subtitle={\`\${filtered.length} of \${ATHLETES.length} athletes\`}
        actions={<Button variant="primary"><UserPlus className="w-4 h-4 mr-1.5" />Register Athlete</Button>}
        controls={
          <>
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search by name or ID…" value={search} onChange={e => setSearch(e.target.value)} suffix={<Search className="w-4 h-4" />} />
            </div>
            <div className="w-44">
              <Select options={SPORT_OPTIONS} value={sport} onChange={setSport} placeholder="Sport" />
            </div>
          </>
        }
      />
      <div className="bg-white rounded-2xl border border-separator shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: 'id',         header: 'ID',          render: a => <span className="font-mono text-xs text-label-tertiary">{a.id}</span> },
            { key: 'name',       header: 'Athlete',     render: a => <div><p className="font-medium text-label-primary">{a.name}</p><p className="text-footnote text-label-tertiary">{a.state}</p></div> },
            { key: 'sport',      header: 'Sport' },
            { key: 'age',        header: 'Age',         render: a => <span className="text-label-secondary">{a.age} yrs</span> },
            { key: 'registered', header: 'Registered',  render: a => <span className="text-label-tertiary text-sm">{a.registered}</span> },
            { key: 'status',     header: 'Status',      render: a => <StatusBadge status={a.status} /> },
            { key: 'actions',    header: '',            className: 'w-24', render: () => <ActionButtons showView showEdit showDelete onView={() => {}} onEdit={() => {}} onDelete={() => {}} /> },
          ]}
          data={filtered}
          keyExtractor={a => a.id}
          emptyMessage="No athletes match your filters."
        />
      </div>
    </div>
  )
}
`
}
