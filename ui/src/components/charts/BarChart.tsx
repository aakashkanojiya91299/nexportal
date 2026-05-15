'use client'

import React from 'react'
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChartSeries {
  key: string
  name: string
  color?: string
}

export interface PortalBarChartProps {
  data: Record<string, string | number>[]
  xKey: string
  series: ChartSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  rounded?: boolean
  className?: string
}

const DEFAULT_COLORS = ['#000080', '#FF9933', '#138808', '#6366f1', '#ec4899', '#06b6d4']

function getColor(s: ChartSeries, i: number): string {
  if (s.color) return s.color
  if (typeof document !== 'undefined') {
    const cssVar = i === 0 ? '--primary' : i === 1 ? '--accent' : '--success'
    const val = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
    if (val) return val
  }
  return DEFAULT_COLORS[i % DEFAULT_COLORS.length]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PortalBarChart({
  data, xKey, series,
  height = 280,
  showGrid = true,
  showLegend = true,
  rounded = true,
  className = '',
}: PortalBarChartProps) {
  const colors = series.map((s, i) => getColor(s, i))

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height }}>
        <ReBarChart data={data} barCategoryGap="28%" barGap={4}
          margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          )}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#888' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
            cursor={{ fill: '#f5f5f5', radius: 4 }}
          />
          {showLegend && (
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          )}
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={colors[i]}
              radius={rounded ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
