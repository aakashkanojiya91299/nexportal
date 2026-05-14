'use client'

import React from 'react'
import {
  LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Dot,
} from 'recharts'
import type { ChartSeries } from './BarChart'

export interface PortalLineChartProps {
  data: Record<string, string | number>[]
  xKey: string
  series: ChartSeries[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showDots?: boolean
  curved?: boolean
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

export function PortalLineChart({
  data, xKey, series,
  height = 280,
  showGrid = true,
  showLegend = true,
  showDots = true,
  curved = true,
  className = '',
}: PortalLineChartProps) {
  const colors = series.map((s, i) => getColor(s, i))

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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
            <Line
              key={s.key}
              type={curved ? 'monotone' : 'linear'}
              dataKey={s.key}
              name={s.name}
              stroke={colors[i]}
              strokeWidth={2.5}
              dot={showDots ? { fill: colors[i], strokeWidth: 0, r: 4 } : false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
