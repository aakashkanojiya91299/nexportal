'use client';

/**
 * Gauge & Heatmap charts: Gauge, SolidGauge, Heatmap, CalendarHeatmap
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface GaugeChartProps extends BaseChartProps {
  value?: number;
  min?: number;
  max?: number;
  units?: string;
}
export interface HeatmapChartProps extends BaseChartProps {
  xCategories?: string[];
  yCategories?: string[];
  heatData?: [number, number, number][];
}
export interface CalendarHeatmapChartProps extends BaseChartProps {
  /** Full year to display, e.g. 2024 */
  year?: number;
  /** Array of [date-string, value], e.g. ['2024-03-15', 42] */
  calData?: Array<[string, number]>;
}

/* ── 1. Angular Gauge ─────────────────────────────────────────────── */
export function HCGaugeChart(props: GaugeChartProps) {
  const { title, value = 0, min = 0, max = 100, units = '', height = 300, className, options, onChartReady, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: { trigger: 'item', formatter: `{b}: {c}${units}` },
    series: [
      {
        type: 'gauge',
        min, max,
        data: [{ value, name: title ?? 'Value' }],
        progress: { show: true, width: 16 },
        axisLine: { lineStyle: { width: 16 } },
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { width: 2, color: t.border } },
        axisLabel: { distance: 20, color: t.muted, fontSize: 11 },
        pointer: { itemStyle: { color: t.primary } },
        anchor: { show: true, showAbove: true, size: 12, itemStyle: { borderWidth: 2 } },
        title: { show: false },
        detail: {
          valueAnimation: true,
          formatter: `{value}${units}`,
          color: t.text, fontSize: 22, fontWeight: 700,
          offsetCenter: [0, '70%'],
        },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Solid Gauge (arc progress) ───────────────────────────────── */
export function HCSolidGaugeChart(props: GaugeChartProps) {
  const { title, value = 0, min = 0, max = 100, units = '', height = 300, className, options, onChartReady } = props;
  const t = buildTheme();
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const opt: EChartsOption = {
    ...baseOption(title, false, false),
    series: [
      {
        type: 'gauge',
        startAngle: 90, endAngle: -270,
        min, max,
        pointer: { show: false },
        progress: { show: true, overlap: false, roundCap: true, clip: false, itemStyle: { borderWidth: 1 } },
        axisLine: { lineStyle: { width: 18 } },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        data: [{ value, name: `${Math.round(pct)}%`, itemStyle: { color: t.primary } }],
        title: { offsetCenter: [0, '-20%'], fontSize: 12, color: t.muted },
        detail: {
          width: 50, height: 14,
          fontSize: 24, fontWeight: 700, color: t.text,
          formatter: `{value}${units}`,
          offsetCenter: [0, '20%'],
        },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Cartesian Heatmap ─────────────────────────────────────────── */
export function HCHeatmapChart(props: HeatmapChartProps) {
  const { title, xCategories = [], yCategories = [], heatData = [], height = 300, className, options, onChartReady, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    xAxis: { type: 'category', data: xCategories, splitArea: { show: true } },
    yAxis: { type: 'category', data: yCategories, splitArea: { show: true } },
    visualMap: {
      min: 0, max: Math.max(...heatData.map((d) => d[2]), 1),
      calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
      inRange: { color: [t.bg, t.primary] },
    },
    tooltip: {
      trigger: 'item',
      formatter: (p: unknown) => {
        const params = p as { value: [number, number, number] };
        return `${xCategories[params.value[0]]}, ${yCategories[params.value[1]]}: ${params.value[2]}`;
      },
    },
    series: [{ type: 'heatmap', data: heatData, emphasis: { itemStyle: { shadowBlur: 10 } } }],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Calendar Heatmap ──────────────────────────────────────────── */
export function HCCalendarHeatmapChart(props: CalendarHeatmapChartProps) {
  const { title, year = new Date().getFullYear(), calData = [], height = 180, className, options, onChartReady, showTooltip = true } = props;
  const t = buildTheme();
  const maxVal = Math.max(...calData.map((d) => d[1]), 1);
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: {
      trigger: 'item',
      formatter: (p: unknown) => {
        const params = p as { value: [string, number] };
        return `${params.value[0]}: ${params.value[1]}`;
      },
    },
    visualMap: {
      show: true, min: 0, max: maxVal,
      type: 'continuous', orient: 'horizontal', left: 'center', bottom: 0,
      inRange: { color: [t.bg, t.primary] },
    },
    calendar: {
      top: title ? 50 : 20, left: 30, right: 30, bottom: 40,
      range: String(year),
      itemStyle: { borderWidth: 0.5, borderColor: t.border },
      yearLabel: { show: false },
      dayLabel: { color: t.muted, fontSize: 10 },
      monthLabel: { color: t.muted, fontSize: 10 },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: calData }],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
