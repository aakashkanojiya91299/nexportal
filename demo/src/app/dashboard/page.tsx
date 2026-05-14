'use client'

import { useState } from 'react'
import { useJwtAuth, PortalBarChart, PortalAreaChart, PortalDonutChart, StatusBadge, DatePicker } from '@lucifer91299/ui'
import { Users, TrendingUp, ShoppingCart, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Members', value: '4,821',  delta: '+12%', icon: Users,        bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Revenue',       value: '₹2.4L',  delta: '+8%',  icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
  { label: 'Orders',        value: '1,429',  delta: '+23%', icon: ShoppingCart, bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Active Now',    value: '94',     delta: '+5%',  icon: Activity,     bg: 'bg-purple-50', fg: 'text-purple-600' },
]

const MONTHLY = [
  { month: 'Jan', orders: 38,  members: 120, revenue: 48 },
  { month: 'Feb', orders: 52,  members: 134, revenue: 62 },
  { month: 'Mar', orders: 47,  members: 128, revenue: 55 },
  { month: 'Apr', orders: 65,  members: 156, revenue: 78 },
  { month: 'May', orders: 71,  members: 172, revenue: 85 },
  { month: 'Jun', orders: 60,  members: 160, revenue: 72 },
  { month: 'Jul', orders: 84,  members: 198, revenue: 96 },
  { month: 'Aug', orders: 79,  members: 185, revenue: 92 },
  { month: 'Sep', orders: 91,  members: 214, revenue: 108 },
  { month: 'Oct', orders: 105, members: 238, revenue: 122 },
  { month: 'Nov', orders: 98,  members: 224, revenue: 115 },
  { month: 'Dec', orders: 112, members: 260, revenue: 135 },
]

const ORDER_STATUS = [
  { name: 'Completed', value: 384, color: '#138808' },
  { name: 'Approved',  value: 213, color: '#000080' },
  { name: 'Pending',   value: 97,  color: '#FF9933' },
  { name: 'Rejected',  value: 42,  color: '#ef4444' },
  { name: 'Cancelled', value: 28,  color: '#9ca3af' },
]

const activity = [
  { user: 'Ravi Sharma',  action: 'New order placed',    time: '2 min ago',  status: 'pending'   },
  { user: 'Priya Mehta',  action: 'Payment received',    time: '8 min ago',  status: 'completed' },
  { user: 'Arjun Patel',  action: 'Account updated',     time: '15 min ago', status: 'approved'  },
  { user: 'Sunita Rao',   action: 'Membership renewed',  time: '1 hr ago',   status: 'completed' },
  { user: 'Vikram Desai', action: 'Document uploaded',   time: '3 hr ago',   status: 'pending'   },
]

export default function DashboardHome() {
  const { user } = useJwtAuth()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate]     = useState('')

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-title1 text-label-primary font-semibold">
            Welcome back, {String(user?.name ?? 'Admin')} 👋
          </h1>
          <p className="text-body text-label-secondary mt-0.5">Here&apos;s what&apos;s happening today.</p>
        </div>
        {/* Date range filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <DatePicker value={fromDate} onChange={setFromDate} placeholder="From date" className="w-36" disableFuture />
          <span className="text-label-tertiary text-subhead">–</span>
          <DatePicker value={toDate}   onChange={setToDate}   placeholder="To date"   className="w-36" disableFuture />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, icon: Icon, bg, fg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-separator">
            <div className="flex items-center justify-between mb-3">
              <span className="text-subhead text-label-secondary font-medium">{label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg} ${fg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-title1 font-bold text-label-primary">{value}</p>
            <p className="text-footnote text-green-600 mt-0.5 font-medium">{delta} this month</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart - spans 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-separator shadow-sm p-5">
          <div className="mb-4">
            <p className="text-headline font-semibold text-label-primary">Orders &amp; Members per Month</p>
            <p className="text-footnote text-label-tertiary mt-0.5">Current year overview</p>
          </div>
          <PortalBarChart
            data={MONTHLY}
            xKey="month"
            series={[
              { key: 'orders',  name: 'Orders'  },
              { key: 'members', name: 'Members' },
            ]}
            height={220}
          />
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <div className="mb-2">
            <p className="text-headline font-semibold text-label-primary">Order Status</p>
            <p className="text-footnote text-label-tertiary mt-0.5">All time breakdown</p>
          </div>
          <PortalDonutChart
            data={ORDER_STATUS}
            height={230}
            centerValue="764"
            centerLabel="Orders"
            showLegend
          />
        </div>
      </div>

      {/* Area chart - Revenue */}
      <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
        <div className="mb-4">
          <p className="text-headline font-semibold text-label-primary">Revenue Trend (₹ thousands)</p>
          <p className="text-footnote text-label-tertiary mt-0.5">Monthly revenue over the year</p>
        </div>
        <PortalAreaChart
          data={MONTHLY}
          xKey="month"
          series={[{ key: 'revenue', name: 'Revenue (₹K)' }]}
          height={200}
        />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-6 py-4 border-b border-separator">
          <h2 className="text-headline font-semibold text-label-primary">Recent Activity</h2>
        </div>
        <table className="w-full">
          <thead className="bg-surface-secondary text-subhead text-label-secondary font-medium">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">Time</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-separator">
            {activity.map(({ user: name, action, time, status }) => (
              <tr key={name} className="hover:bg-surface-secondary/50 transition-colors">
                <td className="px-6 py-4 text-body font-medium text-label-primary">{name}</td>
                <td className="px-6 py-4 text-body text-label-secondary">{action}</td>
                <td className="px-6 py-4 text-body text-label-tertiary">{time}</td>
                <td className="px-6 py-4"><StatusBadge status={status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
