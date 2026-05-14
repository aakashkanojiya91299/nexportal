'use client'

import { useState } from 'react'
import {
  PageShell, Breadcrumbs,
  Button, Input, Select, Badge, Card, AlertBanner, LoadingSpinner,
  DataTable, StatusBadge, ActionButtons, TricolorBar,
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
  return (
    <p className="text-caption1 font-semibold uppercase tracking-wider text-label-tertiary mb-2">{children}</p>
  )
}

// ── Demo data ────────────────────────────────────────────────────────────────

type Order = { id: number; member: string; item: string; amount: string; status: string; date: string }

const ORDERS: Order[] = [
  { id: 1, member: 'Ravi Sharma',  item: '.22 LR Ammunition', amount: '₹3,200', status: 'approved',  date: '12 Jan 2024' },
  { id: 2, member: 'Priya Mehta',  item: 'Rifle Maintenance', amount: '₹1,800', status: 'pending',   date: '14 Jan 2024' },
  { id: 3, member: 'Arjun Patel',  item: 'Shooting Gloves',   amount: '₹950',   status: 'completed', date: '15 Jan 2024' },
  { id: 4, member: 'Sunita Rao',   item: 'Eye Protection',    amount: '₹1,200', status: 'rejected',  date: '17 Jan 2024' },
  { id: 5, member: 'Vikram Desai', item: '9mm Pistol Ammo',   amount: '₹5,400', status: 'paid',      date: '18 Jan 2024' },
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ComponentsPage() {
  const [selectVal, setSelectVal] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [tableSearch, setTableSearch] = useState('')

  const filtered = ORDERS.filter((o) =>
    tableSearch === '' || o.member.toLowerCase().includes(tableSearch.toLowerCase()) || o.item.toLowerCase().includes(tableSearch.toLowerCase()),
  )

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-14 pb-16">

      <PageShell
        title="Component Library"
        subtitle="All @lucifer91299/ui components — ready to copy and drop into your project."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Components' }]} />}
      />

      {/* ── Stats Overview ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Stats Cards" description="Use plain Cards with icons for metric tiles." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Members', value: '4,821',  delta: '+12%', icon: Users,        bg: 'bg-blue-50',   fg: 'text-blue-600'   },
            { label: 'Revenue',       value: '₹2.4L',  delta: '+8%',  icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
            { label: 'Orders',        value: '1,429',  delta: '+23%', icon: ShoppingCart, bg: 'bg-orange-50', fg: 'text-orange-600' },
            { label: 'Active Now',    value: '94',     delta: '+5%',  icon: Activity,     bg: 'bg-purple-50', fg: 'text-purple-600' },
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

      {/* ── Buttons ────────────────────────────────────────────────────────── */}
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
              <Label>States</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" isLoading>Saving…</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="accent">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Member
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-1.5" /> Export CSV
                </Button>
                <Button variant="tinted">
                  <Zap className="w-4 h-4 mr-1.5" /> Quick Action
                </Button>
              </div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Input" description="Text, number, password, email with labels, helpers, errors, prefix and suffix slots." />
        <PreviewCard>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input
                label="Default"
                placeholder="Type something…"
              />
              <Input
                label="With helper text"
                placeholder="Enter email…"
                helperText="We'll never share your email."
              />
              <Input
                label="Required field"
                placeholder="Full name"
                required
              />
              <Input
                label="Validation error"
                placeholder="Enter value…"
                error="This field is required"
              />
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
              <Input
                label="Amount"
                placeholder="0.00"
                type="number"
                labelRight={<span className="text-footnote text-primary cursor-pointer hover:underline">Use max</span>}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                suffix={<Mail className="w-4 h-4 text-label-tertiary" />}
              />
              <Input
                label="Disabled"
                placeholder="Cannot edit this field"
                disabled
              />
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Select ─────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Select" description="Custom dropdown with optional search, add-new action, and full keyboard support." />
        <PreviewCard>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Select
                label="Basic dropdown"
                options={STATE_OPTIONS}
                value={selectVal}
                onChange={setSelectVal}
                placeholder="Pick a state…"
              />
              <Select
                label="Searchable"
                options={STATE_OPTIONS}
                value={selectVal}
                onChange={setSelectVal}
                placeholder="Search states…"
                searchable
              />
              <Select
                label="Searchable + Add new"
                options={STATE_OPTIONS}
                value={selectVal}
                onChange={setSelectVal}
                placeholder="Select or add…"
                searchable
                onAddNew={() => alert('Open add state modal')}
                addNewLabel="+ Add new state"
              />
              <Select
                label="Required with error"
                options={STATE_OPTIONS}
                value=""
                onChange={() => {}}
                placeholder="Select state…"
                required
                error="Please select a state"
              />
              <Select
                label="Disabled"
                options={STATE_OPTIONS}
                value="mh"
                onChange={() => {}}
                placeholder="Cannot change"
                disabled
              />
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Badge ──────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Badge &amp; StatusBadge" description="Semantic colour chips for categories and workflow states." />
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
                <StatusBadge status="active" />
                <StatusBadge status="pending" />
                <StatusBadge status="approved" />
                <StatusBadge status="rejected" />
                <StatusBadge status="completed" />
                <StatusBadge status="paid" />
                <StatusBadge status="scheduled" />
                <StatusBadge status="inactive" />
                <StatusBadge status="cancelled" />
              </div>
            </div>
            <div>
              <Label>In context — member list</Label>
              <div className="rounded-xl border border-separator overflow-hidden">
                {[
                  { name: 'Ravi Sharma',  role: 'Admin',  status: 'active'   },
                  { name: 'Priya Mehta',  role: 'Coach',  status: 'pending'  },
                  { name: 'Arjun Patel',  role: 'Member', status: 'inactive' },
                ].map(({ name, role, status }, i) => (
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

      {/* ── AlertBanner ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="AlertBanner" description="Contextual feedback messages for form validation, system notices, and confirmations." />
        <PreviewCard>
          <div className="p-6 space-y-3">
            <AlertBanner variant="success">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span><strong>Saved.</strong> Your profile changes have been updated successfully.</span>
              </div>
            </AlertBanner>
            <AlertBanner variant="error">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span><strong>Error.</strong> Could not connect to the server. Please try again.</span>
              </div>
            </AlertBanner>
            <AlertBanner variant="warning">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span><strong>Warning.</strong> Your session will expire in 5 minutes.</span>
              </div>
            </AlertBanner>
            <AlertBanner variant="info">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span><strong>Update available.</strong> A new version of the SDK is available — <a href="#" className="underline font-medium">see changelog</a>.</span>
              </div>
            </AlertBanner>
          </div>
        </PreviewCard>
      </section>

      {/* ── LoadingSpinner ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="LoadingSpinner" description="Inline activity indicator in three sizes — composable inside buttons, overlays, or cards." />
        <PreviewCard>
          <div className="p-6">
            <div className="flex items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-caption1 text-label-tertiary">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="md" />
                <span className="text-caption1 text-label-tertiary">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="lg" />
                <span className="text-caption1 text-label-tertiary">lg</span>
              </div>
              <div className="flex flex-col gap-2 ml-6">
                <span className="text-caption1 text-label-tertiary mb-1">In a card</span>
                <div className="bg-surface-secondary rounded-xl p-8 flex items-center justify-center w-40 h-20">
                  <LoadingSpinner size="md" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-caption1 text-label-tertiary mb-1">Inside button</span>
                <Button variant="primary" isLoading>Processing…</Button>
              </div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── Card ───────────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="Card" description="Surface container in default and elevated variants for grouping related content." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Default card</Label>
            <Card className="p-6">
              <p className="text-headline font-semibold text-label-primary mb-1">Member Summary</p>
              <p className="text-subhead text-label-secondary mb-4">Registration overview for the current quarter.</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['1,284', 'Total'], ['92', 'Pending'], ['38', 'Lapsed']].map(([n, l]) => (
                  <div key={l} className="bg-surface-secondary rounded-lg p-2">
                    <p className="text-title2 font-bold text-label-primary">{n}</p>
                    <p className="text-caption1 text-label-tertiary">{l}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div>
            <Label>Elevated card</Label>
            <Card variant="elevated" className="p-6">
              <p className="text-headline font-semibold text-label-primary mb-1">Quick Actions</p>
              <p className="text-subhead text-label-secondary mb-4">Frequently used operations.</p>
              <div className="flex flex-col gap-2">
                <Button variant="primary">New Order</Button>
                <Button variant="outline">View Reports</Button>
                <Button variant="tinted">Manage Slots</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── TricolorBar ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="TricolorBar" description="Thin decorative stripe in brand primary / accent / success — appears at the top of every sidebar and login card." />
        <PreviewCard>
          <div className="p-6 space-y-4">
            <div>
              <Label>Standard bar</Label>
              <div className="rounded-lg overflow-hidden border border-separator">
                <TricolorBar />
                <div className="px-4 py-3 text-subhead text-label-secondary">Content below the bar</div>
              </div>
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── DataTable ──────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="DataTable" description="Generic typed table with loading skeletons, empty states, row click, and custom cell renderers." />

        {/* Live table with filtering */}
        <div className="mb-4">
          <Label>Live example — filterable orders table</Label>
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[220px]">
              <Input
                placeholder="Search by member or item…"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                suffix={<Search className="w-4 h-4 text-label-tertiary" />}
              />
            </div>
            {tableSearch && (
              <Button variant="outline" size="sm" onClick={() => setTableSearch('')}>Clear</Button>
            )}
          </div>
          <PreviewCard>
            <DataTable
              columns={[
                {
                  key: 'id', header: '#',
                  render: (_, i) => <span className="text-label-tertiary text-footnote font-mono">{i + 1}</span>,
                  className: 'w-10',
                },
                {
                  key: 'member', header: 'Member',
                  render: (o: Order) => <span className="font-medium text-label-primary">{o.member}</span>,
                },
                { key: 'item', header: 'Item', render: (o: Order) => <span className="text-label-secondary">{o.item}</span> },
                {
                  key: 'amount', header: 'Amount',
                  render: (o: Order) => <span className="font-semibold text-label-primary">{o.amount}</span>,
                },
                { key: 'status', header: 'Status',  render: (o: Order) => <StatusBadge status={o.status} /> },
                { key: 'date',   header: 'Date',    render: (o: Order) => <span className="text-label-tertiary text-footnote">{o.date}</span> },
                {
                  key: 'actions', header: '',
                  render: () => (
                    <ActionButtons
                      showView showApprove showReject showEdit
                      onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}}
                    />
                  ),
                },
              ]}
              data={filtered}
              keyExtractor={(o) => o.id}
              emptyMessage="No orders match your search."
            />
          </PreviewCard>
        </div>

        {/* Loading skeleton */}
        <div>
          <Label>Loading skeleton state</Label>
          <PreviewCard>
            <DataTable
              columns={[
                { key: 'member', header: 'Member' },
                { key: 'item',   header: 'Item'   },
                { key: 'status', header: 'Status' },
                { key: 'actions', header: ''      },
              ]}
              data={[]}
              keyExtractor={(o: Order) => o.id}
              isLoading
              loadingRows={4}
            />
          </PreviewCard>
        </div>
      </section>

      {/* ── ActionButtons ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="ActionButtons" description="Compact icon-button row for table row actions — show only the actions relevant to the row's state." />
        <PreviewCard>
          <div className="p-6">
            <div className="divide-y divide-separator rounded-xl border border-separator overflow-hidden">
              {[
                { label: 'Pending order — approve / reject / view', props: { showView: true, showApprove: true, showReject: true } },
                { label: 'Active record — view / edit / delete',     props: { showView: true, showEdit: true, showDelete: true } },
                { label: 'All actions enabled',                      props: { showView: true, showApprove: true, showReject: true, showEdit: true, showDelete: true } },
                { label: 'All actions disabled',                     props: { showView: true, showApprove: true, showReject: true, showEdit: true, showDelete: true, disabled: true } },
              ].map(({ label, props }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-subhead text-label-secondary">{label}</span>
                  <ActionButtons
                    {...props}
                    onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} onDelete={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </PreviewCard>
      </section>

      {/* ── PageShell + Breadcrumbs ─────────────────────────────────────────── */}
      <section>
        <SectionHeader title="PageShell &amp; Breadcrumbs" description="Consistent inner-page header with title, breadcrumbs, actions slot, and a controls panel for filters." />
        <PreviewCard className="overflow-visible">
          <div className="border-b border-separator">
            <PageShell
              title="Members"
              subtitle="1,284 registered members"
              breadcrumbs={<Breadcrumbs items={[{ label: 'Members', href: '/dashboard/members' }, { label: 'List' }]} />}
              actions={
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Add Member
                </Button>
              }
              controls={
                <>
                  <div className="flex-1 min-w-[200px]">
                    <Input placeholder="Search members…" suffix={<Search className="w-4 h-4 text-label-tertiary" />} />
                  </div>
                  <div className="w-40">
                    <Select options={STATE_OPTIONS} value="" onChange={() => {}} placeholder="State" searchable />
                  </div>
                  <div className="w-36">
                    <Select options={[{ value: '', label: 'All Statuses' }, { value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }]} value="" onChange={() => {}} placeholder="Status" />
                  </div>
                </>
              }
            />
          </div>
          <div className="px-6 py-4 text-subhead text-label-tertiary text-center">
            ↑ PageShell renders the header and controls panel — table goes below here
          </div>
        </PreviewCard>
      </section>

    </div>
  )
}
