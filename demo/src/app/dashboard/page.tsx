'use client'

import { useJwtAuth } from '@lucifer91299/ui'
import { Users, TrendingUp, ShoppingCart, Activity } from 'lucide-react'

const stats = [
  { label: 'Total Users',   value: '2,847',  delta: '+12%', icon: Users,         color: 'bg-blue-50   text-blue-600'   },
  { label: 'Revenue',       value: '₹48,295', delta: '+8%',  icon: TrendingUp,    color: 'bg-green-50  text-green-600'  },
  { label: 'Orders',        value: '1,429',  delta: '+23%', icon: ShoppingCart,  color: 'bg-orange-50 text-orange-600' },
  { label: 'Active Now',    value: '94',     delta: '+5%',  icon: Activity,      color: 'bg-purple-50 text-purple-600' },
]

const activity = [
  { user: 'Ravi Sharma',    action: 'New order placed',       time: '2 min ago', status: 'pending'   },
  { user: 'Priya Mehta',    action: 'Payment received',       time: '8 min ago', status: 'completed' },
  { user: 'Arjun Patel',    action: 'Account updated',        time: '15 min ago', status: 'completed' },
  { user: 'Sunita Rao',     action: 'Membership renewed',     time: '1 hr ago',  status: 'completed' },
  { user: 'Vikram Desai',   action: 'Document uploaded',      time: '3 hr ago',  status: 'pending'   },
]

const statusClass: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100  text-green-700',
}

export default function DashboardHome() {
  const { user } = useJwtAuth()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title1 text-label-primary font-semibold">
          Welcome back, {String(user?.name ?? 'Admin')}
        </h1>
        <p className="text-body text-label-secondary mt-0.5">
          Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-separator">
            <div className="flex items-center justify-between mb-3">
              <span className="text-subhead text-label-secondary font-medium">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-title1 font-bold text-label-primary">{value}</p>
            <p className="text-footnote text-green-600 mt-1">{delta} this month</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl shadow-sm border border-separator overflow-hidden">
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
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-footnote font-medium capitalize ${statusClass[status]}`}>
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SDK info */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
        <p className="text-callout font-semibold text-primary mb-1">@lucifer91299/ui SDK Demo</p>
        <p className="text-subhead text-label-secondary">
          This dashboard is rendered by <code className="text-xs bg-white rounded px-1 py-0.5">DashboardLayout</code> from the SDK.
          The sidebar, nav groups, user avatar, and logout are all from the component library.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap text-footnote">
          <a href="/login" className="underline text-primary">Animated Login</a>
          <span className="text-label-tertiary">·</span>
          <a href="/login-simple" className="underline text-primary">Simple Login</a>
          <span className="text-label-tertiary">·</span>
          <span className="text-label-secondary">Demo creds: admin@demo.com / password123</span>
        </div>
      </div>
    </div>
  )
}
