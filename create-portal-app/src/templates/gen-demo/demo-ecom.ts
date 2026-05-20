/** E-commerce demo pages — products, orders, customers, dashboard home */

export function genEcomHomePage(): string {
  return `'use client'

import React from 'react'
import { PageShell, DataTable, StatusBadge, PortalBarChart, PortalDonutChart } from '@lucifer91299/ui'
import { ShoppingCart, TrendingUp, Users, Package } from 'lucide-react'

const STATS = [
  { label: 'Total Revenue',  value: '₹1,24,850', change: '+14%', icon: TrendingUp,   bg: 'bg-green-50',  fg: 'text-green-600'  },
  { label: 'Orders Today',   value: '48',         change: '+6',   icon: ShoppingCart, bg: 'bg-blue-50',   fg: 'text-blue-600'   },
  { label: 'Active Products',value: '312',        change: '+8',   icon: Package,      bg: 'bg-orange-50', fg: 'text-orange-600' },
  { label: 'Customers',      value: '2,104',      change: '+23%', icon: Users,        bg: 'bg-purple-50', fg: 'text-purple-600' },
]

const MONTHLY = [
  { month: 'Jan', orders: 38, revenue: 62 },
  { month: 'Feb', orders: 52, revenue: 84 },
  { month: 'Mar', orders: 47, revenue: 76 },
  { month: 'Apr', orders: 65, revenue: 105 },
  { month: 'May', orders: 71, revenue: 115 },
  { month: 'Jun', orders: 60, revenue: 96 },
  { month: 'Jul', orders: 84, revenue: 136 },
  { month: 'Aug', orders: 79, revenue: 128 },
]

const ORDER_STATUS = [
  { name: 'Delivered', value: 284, color: '#138808' },
  { name: 'Processing', value: 96, color: '#000080' },
  { name: 'Pending',    value: 48, color: '#FF9933' },
  { name: 'Cancelled',  value: 18, color: '#ef4444' },
]

const RECENT_ORDERS = [
  { id: '#ORD-1042', customer: 'Rahul Sharma',  product: 'Running Shoes',   amount: '₹2,499', status: 'delivered' },
  { id: '#ORD-1041', customer: 'Priya Mehta',   product: 'Sports T-Shirt',  amount: '₹899',   status: 'processing' },
  { id: '#ORD-1040', customer: 'Amit Patel',    product: 'Yoga Mat',        amount: '₹1,299', status: 'pending' },
  { id: '#ORD-1039', customer: 'Sneha Iyer',    product: 'Water Bottle',    amount: '₹599',   status: 'delivered' },
  { id: '#ORD-1038', customer: 'Vikram Singh',  product: 'Gym Gloves',      amount: '₹749',   status: 'cancelled' },
]

export default function EcomDashboard() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell
        title="Store Dashboard"
        subtitle="Your e-commerce overview for today."
      />

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
          <p className="text-headline font-semibold text-label-primary mb-1">Orders &amp; Revenue</p>
          <p className="text-footnote text-label-tertiary mb-4">Monthly overview</p>
          <PortalBarChart
            data={MONTHLY} xKey="month"
            series={[{ key: 'orders', name: 'Orders' }, { key: 'revenue', name: 'Revenue (₹K)' }]}
            height={220}
          />
        </div>
        <div className="bg-white rounded-2xl border border-separator shadow-sm p-5">
          <p className="text-headline font-semibold text-label-primary mb-1">Order Status</p>
          <p className="text-footnote text-label-tertiary mb-2">All time</p>
          <PortalDonutChart data={ORDER_STATUS} height={230} centerValue="446" centerLabel="Orders" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-separator overflow-hidden">
        <div className="px-5 py-4 border-b border-separator">
          <h2 className="text-callout font-semibold text-label-primary">Recent Orders</h2>
        </div>
        <DataTable
          columns={[
            { key: 'id',       header: 'Order',    render: (r) => <span className="font-mono text-xs text-label-tertiary">{r.id}</span> },
            { key: 'customer', header: 'Customer', render: (r) => <span className="font-medium text-label-primary">{r.customer}</span> },
            { key: 'product',  header: 'Product',  render: (r) => <span className="text-label-secondary">{r.product}</span> },
            { key: 'amount',   header: 'Amount',   render: (r) => <span className="font-semibold text-label-primary">{r.amount}</span> },
            { key: 'status',   header: 'Status',   render: (r) => <StatusBadge status={r.status} /> },
          ]}
          data={RECENT_ORDERS}
          keyExtractor={(r) => r.id}
        />
      </div>
    </div>
  )
}
`
}

export function genEcomProductsPage(): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, Button, Input, Badge } from '@lucifer91299/ui'
import { Search, Plus, Package } from 'lucide-react'

type Product = { id: number; name: string; category: string; price: string; stock: number; status: string }

const PRODUCTS: Product[] = [
  { id: 1,  name: 'Running Shoes Pro',    category: 'Footwear',   price: '₹2,499', stock: 45,  status: 'active' },
  { id: 2,  name: 'Sports T-Shirt',       category: 'Apparel',    price: '₹899',   stock: 120, status: 'active' },
  { id: 3,  name: 'Yoga Mat Premium',     category: 'Equipment',  price: '₹1,299', stock: 30,  status: 'active' },
  { id: 4,  name: 'Stainless Water Bottle',category: 'Accessories',price: '₹599', stock: 200, status: 'active' },
  { id: 5,  name: 'Gym Gloves',           category: 'Accessories', price: '₹749',  stock: 60,  status: 'active' },
  { id: 6,  name: 'Resistance Bands Set', category: 'Equipment',  price: '₹1,099', stock: 0,   status: 'out_of_stock' },
  { id: 7,  name: 'Sports Shorts',        category: 'Apparel',    price: '₹699',   stock: 85,  status: 'active' },
  { id: 8,  name: 'Jump Rope',            category: 'Equipment',  price: '₹349',   stock: 150, status: 'active' },
  { id: 9,  name: 'Compression Socks',    category: 'Apparel',    price: '₹449',   stock: 95,  status: 'active' },
  { id: 10, name: 'Foam Roller',          category: 'Equipment',  price: '₹899',   stock: 25,  status: 'active' },
  { id: 11, name: 'Protein Shaker',       category: 'Accessories', price: '₹549',  stock: 0,   status: 'out_of_stock' },
  { id: 12, name: 'Dumbbell Set 5kg',     category: 'Equipment',  price: '₹3,499', stock: 12,  status: 'low_stock' },
]

const stockBadge = (p: Product) => {
  if (p.status === 'out_of_stock') return <Badge variant="error">Out of Stock</Badge>
  if (p.status === 'low_stock' || p.stock < 20) return <Badge variant="warning">Low Stock</Badge>
  return <Badge variant="success">In Stock</Badge>
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell
        title="Products"
        subtitle={\`\${filtered.length} of \${PRODUCTS.length} products\`}
        actions={<Button variant="primary"><Plus className="w-4 h-4 mr-1.5" />Add Product</Button>}
        controls={
          <div className="flex-1 max-w-xs">
            <Input
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              suffix={<Search className="w-4 h-4" />}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-separator shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-36 bg-gray-50 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-label-primary text-sm truncate">{p.name}</p>
              <p className="text-xs text-label-tertiary mt-0.5">{p.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-label-primary">{p.price}</span>
                {stockBadge(p)}
              </div>
              <p className="text-xs text-label-tertiary mt-1">{p.stock} units</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
`
}

export function genEcomOrdersPage(): string {
  return `'use client'

import React, { useState } from 'react'
import { PageShell, DataTable, StatusBadge, Input, Select } from '@lucifer91299/ui'
import { Search } from 'lucide-react'

type Order = { id: string; customer: string; product: string; amount: string; date: string; status: string }

const ORDERS: Order[] = [
  { id: '#ORD-1042', customer: 'Rahul Sharma',   product: 'Running Shoes Pro',     amount: '₹2,499', date: '20 May 2025', status: 'delivered'  },
  { id: '#ORD-1041', customer: 'Priya Mehta',    product: 'Sports T-Shirt',        amount: '₹899',   date: '20 May 2025', status: 'processing' },
  { id: '#ORD-1040', customer: 'Amit Patel',     product: 'Yoga Mat Premium',      amount: '₹1,299', date: '19 May 2025', status: 'pending'    },
  { id: '#ORD-1039', customer: 'Sneha Iyer',     product: 'Water Bottle',          amount: '₹599',   date: '19 May 2025', status: 'delivered'  },
  { id: '#ORD-1038', customer: 'Vikram Singh',   product: 'Gym Gloves',            amount: '₹749',   date: '18 May 2025', status: 'cancelled'  },
  { id: '#ORD-1037', customer: 'Anjali Gupta',   product: 'Sports Shorts',         amount: '₹699',   date: '18 May 2025', status: 'delivered'  },
  { id: '#ORD-1036', customer: 'Ravi Kumar',     product: 'Resistance Bands',      amount: '₹1,099', date: '17 May 2025', status: 'delivered'  },
  { id: '#ORD-1035', customer: 'Meera Nair',     product: 'Compression Socks',     amount: '₹449',   date: '17 May 2025', status: 'processing' },
  { id: '#ORD-1034', customer: 'Karan Malhotra', product: 'Foam Roller',           amount: '₹899',   date: '16 May 2025', status: 'pending'    },
  { id: '#ORD-1033', customer: 'Divya Reddy',    product: 'Dumbbell Set 5kg',      amount: '₹3,499', date: '15 May 2025', status: 'delivered'  },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending',    label: 'Pending'    },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered',  label: 'Delivered'  },
  { value: 'cancelled',  label: 'Cancelled'  },
]

export default function OrdersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const filtered = ORDERS.filter(o => {
    const q = search.toLowerCase()
    if (q && !o.id.includes(q) && !o.customer.toLowerCase().includes(q)) return false
    if (status && o.status !== status) return false
    return true
  })

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <PageShell
        title="Orders"
        subtitle={\`\${filtered.length} of \${ORDERS.length} orders\`}
        controls={
          <>
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Search by order ID or customer…" value={search} onChange={e => setSearch(e.target.value)} suffix={<Search className="w-4 h-4" />} />
            </div>
            <div className="w-44">
              <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} placeholder="Status" />
            </div>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-separator shadow-sm overflow-hidden">
        <DataTable
          columns={[
            { key: 'id',       header: 'Order',    render: r => <span className="font-mono text-xs text-label-tertiary">{r.id}</span> },
            { key: 'customer', header: 'Customer', render: r => <span className="font-medium text-label-primary">{r.customer}</span> },
            { key: 'product',  header: 'Product',  render: r => <span className="text-label-secondary text-sm">{r.product}</span> },
            { key: 'amount',   header: 'Amount',   render: r => <span className="font-semibold">{r.amount}</span> },
            { key: 'date',     header: 'Date',     render: r => <span className="text-label-tertiary text-sm">{r.date}</span> },
            { key: 'status',   header: 'Status',   render: r => <StatusBadge status={r.status} /> },
          ]}
          data={filtered}
          keyExtractor={r => r.id}
          emptyMessage="No orders match your filters."
        />
      </div>
    </div>
  )
}
`
}
