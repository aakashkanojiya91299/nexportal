'use client'

import React from 'react'
import {
  AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { ChartSeries } from './BarChart'

export interface PortalAreaChartProps {
  data: Record<string, string | number>[]
  xKey: string
  series: ChartSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
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

export function PortalAreaChart({
  data, xKey, series,
  height = 280,
  showGrid = true,
  showLegend = true,
  stacked = false,
  className = '',
}: PortalAreaChartProps) {
  const colors = series.map((s, i) => getColor(s, i))

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReAreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={colors[i]} stopOpacity={0.18} />
                <stop offset="95%" stopColor={colors[i]} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>
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
          />
          {showLegend && (
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          )}
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={colors[i]}
              strokeWidth={2.5}
              fill={`url(#grad-${s.key})`}
              stackId={stacked ? 'stack' : undefined}
              dot={{ fill: colors[i], strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
