'use client'

import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DonutSlice {
  name?: string
  label?: string
  value: number
  color?: string
}

export interface PortalDonutChartProps {
  data: DonutSlice[]
  height?: number
  innerRadius?: number | string
  outerRadius?: number | string
  centerLabel?: string
  centerValue?: string | number
  showLegend?: boolean
  showTooltip?: boolean
  className?: string
}

const DEFAULT_COLORS = ['#000080', '#FF9933', '#138808', '#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981']

function getSliceColor(slice: DonutSlice, i: number): string {
  if (slice.color) return slice.color
  return DEFAULT_COLORS[i % DEFAULT_COLORS.length]
}

// ── Custom label in center ────────────────────────────────────────────────────

function CenterLabel({ cx, cy, label, value }: { cx?: number; cy?: number; label?: string; value?: string | number }) {
  if (!label && value == null) return null
  return (
    <g>
      {value != null && (
        <text x={cx} y={(cy ?? 0) - (label ? 6 : 0)} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 22, fontWeight: 700, fill: '#1a1a1a' }}>
          {value}
        </text>
      )}
      {label && (
        <text x={cx} y={(cy ?? 0) + (value != null ? 18 : 0)} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 11, fill: '#888', fontWeight: 500 }}>
          {label}
        </text>
      )}
    </g>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PortalDonutChart({
  data,
  height = 280,
  innerRadius = '58%',
  outerRadius = '78%',
  centerLabel,
  centerValue,
  showLegend = true,
  showTooltip = true,
  className = '',
}: PortalDonutChartProps) {
  const normalized = data.map((d) => ({ ...d, name: d.name ?? d.label ?? '' }))
  const colors = data.map((d, i) => getSliceColor(d, i))

  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 100, height }}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {showTooltip && (
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(value) => <span style={{ color: '#555' }}>{value}</span>}
            />
          )}
          <Pie
            data={normalized}
            cx="50%"
            cy={showLegend ? '42%' : '50%'}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            label={false}
          >
            {normalized.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i]} />
            ))}
            {(centerLabel || centerValue != null) && (
              <CenterLabel label={centerLabel} value={centerValue} />
            )}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
