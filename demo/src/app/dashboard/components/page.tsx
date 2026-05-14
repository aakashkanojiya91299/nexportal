'use client'

import { useState } from 'react'
import {
  PageShell, Breadcrumbs,
  Button, Input, Select, Badge, Card, AlertBanner, LoadingSpinner,
  DataTable, StatusBadge, ActionButtons,
} from '@lucifer91299/ui'
import { Search, Mail, Eye, EyeOff } from 'lucide-react'

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
  { value: 'dl', label: 'Delhi' },
]

export default function ComponentsPage() {
  const [selectVal, setSelectVal]   = useState('')
  const [searchVal, setSearchVal]   = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [showAlert, setShowAlert]   = useState(true)

  return (
    <div className="p-6 space-y-10">
      <PageShell
        title="Components"
        subtitle="All SDK components in one place — copy any snippet to get started."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Components' }]} />}
      />

      {/* ── Buttons ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">Button</h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" loading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </Card>
      </section>

      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">Input</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Default"        placeholder="Type here…" />
            <Input label="With helper"    placeholder="Enter email…" helperText="We'll never share your email." />
            <Input label="With error"     placeholder="Enter name…" error="This field is required" />
            <Input label="Required"       placeholder="Enter value…" required />
            <Input
              label="With suffix"
              placeholder="Search…"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              suffix={<Search className="w-4 h-4" />}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password…"
              suffix={
                <button type="button" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Input
              label="With labelRight"
              placeholder="Amount…"
              labelRight={<span className="text-footnote text-primary cursor-pointer">Use max</span>}
              type="number"
            />
            <Input label="Email" type="email" placeholder="you@example.com" suffix={<Mail className="w-4 h-4" />} />
            <Input label="Disabled" placeholder="Cannot edit" disabled />
          </div>
        </Card>
      </section>

      {/* ── Select ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">Select</h2>
        <Card className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Basic"
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
              label="With Add New"
              options={STATE_OPTIONS}
              value={selectVal}
              onChange={setSelectVal}
              placeholder="Select or add…"
              searchable
              onAddNew={() => alert('Open add new modal')}
              addNewLabel="Add new state…"
            />
            <Select
              label="Required with error"
              options={STATE_OPTIONS}
              value=""
              onChange={() => {}}
              placeholder="Select state…"
              required
              error="State is required"
            />
            <Select
              label="Disabled"
              options={STATE_OPTIONS}
              value=""
              onChange={() => {}}
              placeholder="Cannot change"
              disabled
            />
          </div>
        </Card>
      </section>

      {/* ── Badges ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">Badge &amp; StatusBadge</h2>
        <Card className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
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
        </Card>
      </section>

      {/* ── Alerts ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">AlertBanner</h2>
        <div className="space-y-3">
          {showAlert && (
            <AlertBanner variant="error"   message="Something went wrong. Please try again." />
          )}
          <AlertBanner variant="success" message="Your changes have been saved successfully." />
          <AlertBanner variant="warning" message="Your session will expire in 5 minutes." />
          <AlertBanner variant="info"    message="A new version of the SDK is available." />
          <Button variant="ghost" size="sm" onClick={() => setShowAlert((v) => !v)}>
            Toggle error banner
          </Button>
        </div>
      </section>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">LoadingSpinner</h2>
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      </section>

      {/* ── DataTable ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">DataTable</h2>
        <div className="bg-white rounded-xl border border-separator shadow-sm overflow-hidden">
          <DataTable
            columns={[
              { key: 'id', header: '#', render: (_, i) => <span className="text-label-tertiary text-footnote">{i + 1}</span>, className: 'w-10' },
              {
                key: 'member', header: 'Member',
                render: (o: Order) => <span className="font-medium text-label-primary">{o.member}</span>,
              },
              { key: 'item', header: 'Item' },
              { key: 'amount', header: 'Amount', render: (o: Order) => <span className="font-semibold">{o.amount}</span> },
              { key: 'status', header: 'Status', render: (o: Order) => <StatusBadge status={o.status} /> },
              { key: 'date', header: 'Date' },
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
            data={ORDERS}
            keyExtractor={(o) => o.id}
          />
        </div>

        {/* Loading skeleton preview */}
        <div className="mt-4 bg-white rounded-xl border border-separator shadow-sm overflow-hidden">
          <p className="text-footnote text-label-tertiary px-4 pt-3">↓ Loading skeleton state:</p>
          <DataTable
            columns={[
              { key: 'member', header: 'Member' },
              { key: 'item', header: 'Item' },
              { key: 'status', header: 'Status' },
              { key: 'actions', header: '' },
            ]}
            data={[]}
            keyExtractor={(o: Order) => o.id}
            isLoading
            loadingRows={3}
          />
        </div>
      </section>

      {/* ── ActionButtons ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-title2 font-semibold text-label-primary mb-4">ActionButtons</h2>
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div>
              <p className="text-footnote text-label-tertiary mb-1">All actions</p>
              <ActionButtons showView showApprove showReject showEdit showDelete
                onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} onDelete={() => {}} />
            </div>
            <div>
              <p className="text-footnote text-label-tertiary mb-1">View + Edit only</p>
              <ActionButtons showView showEdit onView={() => {}} onEdit={() => {}} />
            </div>
            <div>
              <p className="text-footnote text-label-tertiary mb-1">Disabled state</p>
              <ActionButtons showView showApprove showReject showEdit showDelete disabled
                onView={() => {}} onApprove={() => {}} onReject={() => {}} onEdit={() => {}} onDelete={() => {}} />
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
