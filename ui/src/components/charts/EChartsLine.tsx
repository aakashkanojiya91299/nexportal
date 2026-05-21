'use client';

/**
 * Line & Area charts: Line, Spline, StepLine, StackedLine,
 * Area, AreaSpline, StackedArea, AreaRange
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme, PALETTE,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types consumed by consumers ────────────────────────── */
export interface AreaRangeChartProps extends BaseChartProps {
  rangeSeries?: Array<{ name: string; data: [number, number][] }>;
}
export interface StepLineChartProps extends BaseChartProps {
  step?: 'start' | 'middle' | 'end';
}

/* ── 1. Line ──────────────────────────────────────────────────────── */
export function HCLineChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [], axisLine: { lineStyle: { color: t.border } } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: t.border, type: 'dashed' } } },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'line', data: s.data,
      smooth: false, symbol: 'circle', symbolSize: 6,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Spline ────────────────────────────────────────────────────── */
export function HCSplineChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'line', data: s.data,
      smooth: true, symbol: 'circle', symbolSize: 6,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Step Line ─────────────────────────────────────────────────── */
export function HCStepLineChart(props: StepLineChartProps) {
  const { title, categories, series, step = 'middle', height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'line', step, data: s.data,
      symbol: 'circle', symbolSize: 6,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Stacked Line ──────────────────────────────────────────────── */
export function HCStackedLineChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'line', stack: 'total', data: s.data,
      symbol: 'circle', symbolSize: 5,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 5. Area ──────────────────────────────────────────────────────── */
export function HCAreaChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s, i) => ({
      name: s.name, type: 'line', data: s.data, smooth: false,
      areaStyle: { opacity: 0.3, color: PALETTE[i % PALETTE.length] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 6. Area Spline ───────────────────────────────────────────────── */
export function HCAreaSplineChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s, i) => ({
      name: s.name, type: 'line', data: s.data, smooth: true,
      areaStyle: { opacity: 0.3, color: PALETTE[i % PALETTE.length] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 7. Stacked Area ──────────────────────────────────────────────── */
export function HCStackedAreaChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [], boundaryGap: false },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s, i) => ({
      name: s.name, type: 'line', stack: 'total', smooth: true,
      areaStyle: { opacity: 0.6, color: PALETTE[i % PALETTE.length] },
      data: s.data,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 8. Area Range ────────────────────────────────────────────────── */
export function HCAreaRangeChart(props: AreaRangeChartProps) {
  const { title, categories, series, rangeSeries, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const lineSeries = (series ?? []).map((s) => ({
    name: s.name, type: 'line', data: s.data, smooth: true,
  }));
  const bandSeries = (rangeSeries ?? []).map((s, i) => ({
    name: s.name, type: 'line',
    data: s.data.map((d) => d[1]),
    smooth: true, lineStyle: { opacity: 0 },
    areaStyle: { opacity: 0.3, color: PALETTE[i % PALETTE.length] },
    stack: `band_${i}`,
  }));
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: [...lineSeries, ...bandSeries] as EChartsOption['series'],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
