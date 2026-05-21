'use client';

/**
 * Pie-family charts: Pie, Donut, Nightingale/Rose, Funnel, Polar/Radar
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface PolarChartProps extends BaseChartProps {
  indicators?: string[];
}

/* ── 1. Pie ───────────────────────────────────────────────────────── */
export function HCPieChart(props: BaseChartProps) {
  const { title, data, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['0%', '65%'],
        center: ['50%', '50%'],
        data: (data ?? []).map((d) => ({ name: d.name, value: d.value })),
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Donut ─────────────────────────────────────────────────────── */
export function HCDonutChart(props: BaseChartProps) {
  const { title, data, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '50%'],
        data: (data ?? []).map((d) => ({ name: d.name, value: d.value })),
        label: { show: false },
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Nightingale / Rose ────────────────────────────────────────── */
export function HCNightingaleChart(props: BaseChartProps) {
  const { title, data = [], height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['20%', '70%'],
        roseType: 'area',
        data: data.map((d) => ({ name: d.name, value: d.value })),
        label: { show: true, formatter: '{b}' },
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Funnel ────────────────────────────────────────────────────── */
export function HCFunnelChart(props: BaseChartProps) {
  const { title, data = [], height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'funnel',
        data: data.map((d) => ({ name: d.name, value: d.value })),
        gap: 2,
        label: { show: true, position: 'inside', formatter: '{b}: {c}' },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 20 } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 5. Polar / Radar ─────────────────────────────────────────────── */
export function HCPolarChart(props: PolarChartProps) {
  const { title, series, indicators = [], height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    tooltip: { trigger: 'item' },
    radar: { indicator: indicators.map((name) => ({ name, max: 100 })) },
    series: [
      {
        type: 'radar',
        data: (series ?? []).map((s) => ({ name: s.name, value: s.data as number[] })),
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
