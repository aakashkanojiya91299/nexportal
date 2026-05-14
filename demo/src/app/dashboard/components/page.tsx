'use client'

import { useState } from 'react'
import {
  PageShell, Breadcrumbs,
  Button, Input, Select, Badge, Card, AlertBanner, LoadingSpinner,
  DataTable, StatusBadge, ActionButtons, TricolorBar, DatePicker,
  PortalBarChart, PortalLineChart, PortalAreaChart, PortalDonutChart,
} from '@lucifer91299/ui'
import {
  Search, Mail, Eye, EyeOff, Plus, Download, Zap,
  CheckCircle, AlertCircle, Info, AlertTriangle,
  Users, TrendingUp, ShoppingCart, Activity,
} from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-title2 font-bold text-label-primary">{title}</h2>
      {description && <p className="text-subhead text-label-secondary mt-0.5">{description}</p>}
    </div>
  )
}

function PreviewCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-separator shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-caption1 font-semibold uppercase tracking-wider text-label-tertiary mb-2">{children}</p>
}

// ── Demo data ─────────────────────────────────────────────────────────────────

type Order = { id: number; member: string; item: string; amount: string; status: string; date: string }

const ORDERS: Order[] = [
  { id: 1, member: 'Ravi Sharma',  item: '.22 LR Ammunition', amount: '₹3,200', status: 'approved',  date: '12 Jan 2024' },
  { id: 2, member: 'Priya Mehta',  item: 'Rifle Maintenance', amount: '₹1,800', status: 'pending',   date: '14 Jan 2024' },
  { id: 3, member: 'Arjun Patel',  item: 'Shooting Gloves',   amount: '₹950',   status: 'completed', date: '15 Jan 2024' },
  { id: 4, member: 'Sunita Rao',   item: 'Eye Protection',    amount: '₹1,200', status: 'rejected',  date: '17 Jan 2024' },
  { id: 5, member: 'Vikram Desai', item: '9mm Pistol Ammo',   amount: '₹5,400', status: 'paid',      date: '18 Jan 2024' },
]

const MONTHLY_DATA = [
  { month: 'Jan', orders: 38,  revenue: 48000, members: 120 },
  { month: 'Feb', orders: 52,  revenue: 62000, members: 134 },
  { month: 'Mar', orders: 47,  revenue: 55000, members: 128 },
  { month: 'Apr', orders: 65,  revenue: 78000, members: 156 },
  { month: 'May', orders: 71,  revenue: 85000, members: 172 },
  { month: 'Jun', orders: 60,  revenue: 72000, members: 160 },
  { month: 'Jul', orders: 84,  revenue: 96000, members: 198 },
  { month: 'Aug', orders: 79,  revenue: 92000, members: 185 },
  { month: 'Sep', orders: 91,  revenue: 108000, members: 214 },
  { month: 'Oct', orders: 105, revenue: 122000, members: 238 },
  { month: 'Nov', orders: 98,  revenue: 115000, members: 224 },
  { month: 'Dec', orders: 112, revenue: 135000, members: 260 },
]

const STATUS_DONUT = [
  { name: 'Completed',  value: 384, color: '#138808' },
  { name: 'Approved',   value: 213, color: '#000080' },
  { name: 'Pending',    value: 97,  color: '#FF9933' },
  { name: 'Rejected',   value: 42,  color: '#ef4444' },
  { name: 'Cancelled',  value: 28,  color: '#9ca3af' },
]

const STATE_OPTIONS = [
  { value: 'mh', label: 'Maharashtra' },
  { value: 'gj', label: 'Gujarat' },
  { value: 'rj', label: 'Rajasthan' },
  { value: 'ka', label: 'Karnataka' },
  { value: 'dl', label: 'Delhi' },
  { value: 'pb', label: 'Punjab' },
  { value: 'up', label: 'Uttar Pradesh' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ComponentsPage() {
  const [selectVal, setSelectVal]     = useState('')
  const [searchVal, setSearchVal]     = useState('')
  const [showPass, setShowPass]       = useState(false)
  const [date1, setDate1]             = useState('')
  const [date2, setDate2]             = useState('')
  const [tableSearch, setTableSearch] = useState('')

  const filtered = ORDERS.filter((o) =>
    tableSearch === '' ||
    o.member.toLowerCase().includes(tableSearch.toLowerCase()) ||
    o.item.toLowerCase().includes(tableSearch.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-14 pb-16">

      <PageShell
        title="Component Library"
        subtitle="All @lucifer91299/ui components — drop any snippet into your project."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Components' }]} />}
      />

      {/* ── Stats Overview ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Stats Cards" description="Metric tiles built from plain Cards and Lucide icons." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: '4,821', delta: '+12%', icon: Users,        bg: 'bg-blue-50',   fg: 'text-blue-600'   },
            { label: 'Revenue',       value: '₹2.4L', delta: '+8%',  icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
            { label: 'Orders',        value: '1,429', delta: '+23%', icon: ShoppingCart, bg: 'bg-orange-50', fg: 'text-orange-600' },
            { label: 'Active Now',    value: '94',    delta: '+5%',  icon: Activity,     bg: 'bg-purple-50', fg: 'text-purple-600' },
          ].map(({ label, value, delta, icon: Icon, bg, fg }) => (
            <PreviewCard key={label}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-subhead text-label-secondary font-medium">{label}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${fg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-title1 font-bold text-label-primary">{value}</p>
                <p className="text-footnote text-green-600 mt-0.5 font-medium">{delta} this month</p>
              </div>
            </PreviewCard>
          ))}
        </div>
      </section>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Charts" description="Themed recharts wrappers — BarChart, LineChart, AreaChart, DonutChart. Requires: npm install recharts" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Bar Chart */}
          <PreviewCard>
            <div className="px-5 pt-5 pb-2">
              <p className="text-headline font-semibold text-label-primary">Orders per Month</p>
              <p className="text-footnote text-label-tertiary mt-0.5">PortalBarChart</p>
            </div>
            <div className="px-4 pb-5">
              <PortalBarChart
                data={MONTHLY_DATA}
                xKey="month"
                series={[
                  { key: 'orders',  name: 'Orders'  },
                  { key: 'members', name: 'Members' },
                ]}
                height={220}
              />
            </div>
          </PreviewCard>

          {/* Donut Chart */}
          <PreviewCard>
            <div className="px-5 pt-5 pb-2">
              <p className="text-headline font-semibold text-label-primary">Order Status Breakdown</p>
              <p className="text-footnote text-label-tertiary mt-0.5">PortalDonutChart</p>
            </div>
            <div className="px-4 pb-5">
              <PortalDonutChart
                data={STATUS_DONUT}
                height={220}
                centerValue="764"
                centerLabel="Total"
              />
            </div>
          </PreviewCard>

          {/* Line Chart */}
          <PreviewCard>
            <div className="px-5 pt-5 pb-2">
              <p className="text-headline font-semibold text-label-primary">Revenue Trend</p>
              <p className="text-footnote text-label-tertiary mt-0.5">PortalLineChart</p>
            </div>
            <div className="px-4 pb-5">
              <PortalLineChart
                data={MONTHLY_DATA}
                xKey="month"
                series={[{ key: 'revenue', name: 'Revenue (₹)' }]}
                height={220}
              />
            </div>
          </PreviewCard>

          {/* Area Chart */}
          <PreviewCard>
            <div className="px-5 pt-5 pb-2">
              <p className="text-headline font-semibold text-label-primary">Member Growth</p>
              <p className="text-footnote text-label-tertiary mt-0.5">PortalAreaChart</p>
            </div>
            <div className="px-4 pb-5">
              <PortalAreaChart
                data={MONTHLY_DATA}
                xKey="month"
                series={[{ key: 'members', name: 'Members' }]}
                height={220}
              />
            </div>
          </PreviewCard>

        </div>
      </section>

      {/* ── DatePicker ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="DatePicker" description="Calendar with 3-level navigation (days → months → years), weekday exclusion, min/max, and more." />
        <PreviewCard>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <DatePicker
                label="Default"
                value={date1}
                onChange={setDate1}
                placeholder="DD/MM/YYYY"
              />
              <DatePicker
                label="No future dates"
                value={date2}
                onChange={setDate2}
                disableFuture
                placeholder="DD/MM/YYYY"
                helperText="Only past dates can be selected"
              />
              <DatePicker
                label="No past dates"
                value=""
                onChange={() => {}}
                disablePast
                placeholder="DD/MM/YYYY"
                helperText="Future dates only"
              />
              <DatePicker
                label="Weekdays only"
                value=""
                onChange={() => {}}
                excludeWeekends
                placeholder="DD/MM/YYYY"
                helperText="Saturdays and Sundays are disabled"
              />
              <DatePicker
                label="Required with error"
                value=""
                onChange={() => {}}
                required
                error="Date of birth is required"
              />
              <DatePicker
                label="Disabled"
                value="2024-06-15"
                onChange={() => {}}
                disabled
              />
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Button" description="Five semantic variants in three sizes with loading and disabled states." />
        <PreviewCard>
          <div className="p-6 space-y-6">
            <div>
              <Label>Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="tinted">Tinted</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <Label>States &amp; with icons</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading>Saving…</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="accent"><Plus className="w-4 h-4 mr-1.5" /> Add Member</Button>
                <Button variant="outline"><Download className="w-4 h-4 mr-1.5" /> Export CSV</Button>
                <Button variant="tinted"><Zap className="w-4 h-4 mr-1.5" /> Quick Action</Button>
              </div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Input ────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Input" description="Text, number, password, email with labels, helpers, errors, and suffix slot." />
        <PreviewCard>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input label="Default" placeholder="Type something…" />
              <Input label="With helper text" placeholder="Enter email…" helperText="We'll never share your email." />
              <Input label="Required field" placeholder="Full name" required />
              <Input label="Validation error" placeholder="Enter value…" error="This field is required" />
              <Input
                label="Search with suffix"
                placeholder="Search members…"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                suffix={<Search className="w-4 h-4 text-label-tertiary" />}
              />
              <Input
                label="Password toggle"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password…"
                suffix={
                  <button type="button" onClick={() => setShowPass((v) => !v)} className="text-label-tertiary hover:text-label-secondary">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <Input label="Amount" placeholder="0.00" type="number"
                labelRight={<span className="text-footnote text-primary cursor-pointer hover:underline">Use max</span>}
              />
              <Input label="Email" type="email" placeholder="you@example.com" suffix={<Mail className="w-4 h-4 text-label-tertiary" />} />
              <Input label="Disabled" placeholder="Cannot edit this field" disabled />
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Select ───────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Select" description="Custom dropdown with optional search, add-new action, and full keyboard support." />
        <PreviewCard>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Select label="Basic" options={STATE_OPTIONS} value={selectVal} onChange={setSelectVal} placeholder="Pick a state…" />
              <Select label="Searchable" options={STATE_OPTIONS} value={selectVal} onChange={setSelectVal} placeholder="Search states…" searchable />
              <Select label="Add new" options={STATE_OPTIONS} value={selectVal} onChange={setSelectVal} placeholder="Select or add…"
                searchable onAddNew={() => alert('Open add modal')} addNewLabel="+ Add new state" />
              <Select label="Required + error" options={STATE_OPTIONS} value="" onChange={() => {}} placeholder="Select state…"
                required error="Please select a state" />
              <Select label="Disabled" options={STATE_OPTIONS} value="mh" onChange={() => {}} disabled />
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Badge ────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Badge &amp; StatusBadge" description="Semantic chips for roles and workflow states." />
        <PreviewCard>
          <div className="p-6 space-y-6">
            <div>
              <Label>Badge variants</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="primary">Primary</Badge>
                <Badge variant="active">Active</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="inactive">Inactive</Badge>
                <Badge variant="rejected">Rejected</Badge>
              </div>
            </div>
            <div>
              <Label>StatusBadge — all workflow states</Label>
              <div className="flex flex-wrap gap-2">
                {['active', 'pending', 'approved', 'rejected', 'completed', 'paid', 'scheduled', 'inactive', 'cancelled'].map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </div>
            <div>
              <Label>In context — member list</Label>
              <div className="rounded-xl border border-separator overflow-hidden">
                {[['Ravi Sharma', 'Admin', 'active'], ['Priya Mehta', 'Coach', 'pending'], ['Arjun Patel', 'Member', 'inactive']].map(([name, role, status], i) => (
                  <div key={name} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-separator' : ''}`}>
                    <div>
                      <p className="text-callout font-medium text-label-primary">{name}</p>
                      <p className="text-footnote text-label-tertiary">{role}</p>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── AlertBanner ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="AlertBanner" description="Contextual feedback messages for form validation, system notices, and confirmations." />
        <PreviewCard>
          <div className="p-6 space-y-3">
            {[
              { variant: 'success' as const, icon: <CheckCircle className="w-4 h-4 shrink-0" />, msg: 'Saved. Your profile changes have been updated successfully.' },
              { variant: 'error'   as const, icon: <AlertCircle  className="w-4 h-4 shrink-0" />, msg: 'Error. Could not connect to the server. Please try again.' },
              { variant: 'warning' as const, icon: <AlertTriangle className="w-4 h-4 shrink-0" />, msg: 'Warning. Your session will expire in 5 minutes.' },
              { variant: 'info'    as const, icon: <Info          className="w-4 h-4 shrink-0" />, msg: 'Update available. A new SDK version is ready — see changelog.' },
            ].map(({ variant, icon, msg }) => (
              <AlertBanner key={variant} variant={variant}>
                <div className="flex items-center gap-2">{icon}<span>{msg}</span></div>
              </AlertBanner>
            ))}
          </div>
        </PreviewCard>
      </section>

      {/* ── LoadingSpinner + Card ─────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <SectionHeader title="LoadingSpinner" description="Three sizes, composable anywhere." />
            <PreviewCard>
              <div className="p-6">
                <div className="flex items-end gap-8">
                  {(['sm', 'md', 'lg'] as const).map((sz) => (
                    <div key={sz} className="flex flex-col items-center gap-2">
                      <LoadingSpinner size={sz} />
                      <span className="text-caption1 text-label-tertiary">{sz}</span>
                    </div>
                  ))}
                  <Button variant="primary" isLoading className="ml-2">Loading</Button>
                </div>
              </div>
            </PreviewCard>
          </div>
          <div>
            <SectionHeader title="Card" description="Default and elevated surface containers." />
            <div className="flex flex-col gap-3">
              <Card className="p-4">
                <p className="text-callout font-semibold text-label-primary mb-1">Default card</p>
                <p className="text-footnote text-label-secondary">Flat border-based surface for grouping content.</p>
              </Card>
              <Card variant="elevated" className="p-4">
                <p className="text-callout font-semibold text-label-primary mb-1">Elevated card</p>
                <p className="text-footnote text-label-secondary">Shadow-based surface for highlighted sections.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── TricolorBar ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="TricolorBar" description="Brand stripe in primary / accent / success — appears at top of sidebar and login card." />
        <PreviewCard>
          <div className="p-6 space-y-3">
            <div className="rounded-xl overflow-hidden border border-separator">
              <TricolorBar />
              <div className="px-4 py-3 text-subhead text-label-secondary">Content area below the bar</div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── DataTable ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="DataTable" description="Generic typed table with loading skeleton, empty state, and custom cell renderers." />

        <div className="mb-4">
          <Label>Live — filterable orders</Label>
          <div className="mb-3 flex gap-3">
            <div className="flex-1">
              <Input placeholder="Search member or item…" value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                suffix={<Search className="w-4 h-4 text-label-tertiary" />}
              />
            </div>
            {tableSearch && <Button variant="outline" size="sm" onClick={() => setTableSearch('')}>Clear</Button>}
          </div>
          <PreviewCard>
            <DataTable
              columns={[
                { key: 'id', header: '#', render: (_, i) => <span className="text-label-tertiary font-mono text-footnote">{i + 1}</span>, className: 'w-10' },
                { key: 'member', header: 'Member', render: (o: Order) => <span className="font-medium text-label-primary">{o.member}</span> },
                { key: 'item',   header: 'Item',   render: (o: Order) => <span className="text-label-secondary">{o.item}</span> },
                { key: 'amount', header: 'Amount', render: (o: Order) => <span className="font-semibold">{o.amount}</span> },
                { key: 'status', header: 'Status', render: (o: Order) => <StatusBadge status={o.status} /> },
                { key: 'date',   header: 'Date',   render: (o: Order) => <span className="text-footnote text-label-tertiary">{o.date}</span> },
                {
                  key: 'actions', header: '',
                  render: () => <ActionButtons showView showApprove showReject showEdit onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} />,
                },
              ]}
              data={filtered}
              keyExtractor={(o) => o.id}
              emptyMessage="No orders match your search."
            />
          </PreviewCard>
        </div>

        <div>
          <Label>Loading skeleton (isLoading=true)</Label>
          <PreviewCard>
            <DataTable
              columns={[{ key: 'member', header: 'Member' }, { key: 'item', header: 'Item' }, { key: 'status', header: 'Status' }, { key: 'actions', header: '' }]}
              data={[]}
              keyExtractor={(o: Order) => o.id}
              isLoading
              loadingRows={4}
            />
          </PreviewCard>
        </div>
      </section>

      {/* ── ActionButtons ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="ActionButtons" description="Compact icon-button row — show only the actions relevant to each row's state." />
        <PreviewCard>
          <div className="p-6">
            <div className="divide-y divide-separator rounded-xl border border-separator overflow-hidden">
              {[
                { label: 'Pending — approve / reject / view', props: { showView: true, showApprove: true, showReject: true } },
                { label: 'Active — view / edit / delete',     props: { showView: true, showEdit: true, showDelete: true } },
                { label: 'All actions enabled',               props: { showView: true, showApprove: true, showReject: true, showEdit: true, showDelete: true } },
                { label: 'Disabled state',                    props: { showView: true, showApprove: true, showReject: true, showEdit: true, showDelete: true, disabled: true } },
              ].map(({ label, props }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-subhead text-label-secondary">{label}</span>
                  <ActionButtons {...props} onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} onDelete={() => {}} />
                </div>
              ))}
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── PageShell + Breadcrumbs ───────────────────────────────────────── */}
      <section>
        <SectionHeader title="PageShell &amp; Breadcrumbs" description="Consistent inner-page header with title, actions slot, and controls panel." />
        <PreviewCard className="overflow-visible">
          <div className="border-b border-separator">
            <PageShell
              title="Members"
              subtitle="1,284 registered members"
              breadcrumbs={<Breadcrumbs items={[{ label: 'Members', href: '/dashboard/members' }, { label: 'List' }]} />}
              actions={<Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1.5" /> Add Member</Button>}
              controls={
                <>
                  <div className="flex-1 min-w-[200px]">
                    <Input placeholder="Search members…" suffix={<Search className="w-4 h-4 text-label-tertiary" />} />
                  </div>
                  <div className="w-40">
                    <Select options={STATE_OPTIONS} value="" onChange={() => {}} placeholder="State" searchable />
                  </div>
                  <DatePicker value="" onChange={() => {}} placeholder="Filter by date" />
                </>
              }
            />
          </div>
          <div className="px-6 py-4 text-subhead text-label-tertiary text-center">
            ↑ PageShell — header and controls panel above; table or content goes here
          </div>
        </PreviewCard>
      </section>

    </div>
  )
}
