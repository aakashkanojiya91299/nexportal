'use client';

/**
 * Bar & Column charts: Column, Bar, StackedColumn, StackedBar,
 * ColumnRange, Waterfall, BarLabelRotation, DataZoomColumn, BrushColumn
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface ColumnRangeChartProps extends BaseChartProps {
  rangeSeries?: Array<{ name: string; data: [number, number][] }>;
}
export interface WaterfallChartProps extends BaseChartProps {
  data?: Array<{ name: string; value: number }>;
}

/* ── 1. Column (vertical bar) ─────────────────────────────────────── */
export function HCColumnChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: 40, itemStyle: { borderRadius: [4, 4, 0, 0] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Bar (horizontal) ──────────────────────────────────────────── */
export function HCBarChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: categories ?? [] },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: 30, itemStyle: { borderRadius: [0, 4, 4, 0] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Stacked Column ────────────────────────────────────────────── */
export function HCStackedColumnChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', stack: 'total', data: s.data,
      barMaxWidth: 50, emphasis: { focus: 'series' },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Stacked Bar (horizontal) ──────────────────────────────────── */
export function HCStackedBarChart(props: BaseChartProps) {
  const { title, categories, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: categories ?? [] },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', stack: 'total', data: s.data,
      barMaxWidth: 40, emphasis: { focus: 'series' },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 5. Column Range ──────────────────────────────────────────────── */
export function HCColumnRangeChart(props: ColumnRangeChartProps) {
  const { title, categories, rangeSeries, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: categories ?? [] },
    tooltip: { trigger: 'axis' },
    series: (rangeSeries ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      itemStyle: { borderRadius: 4 },
    })) as EChartsOption['series'],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 6. Waterfall ─────────────────────────────────────────────────── */
export function HCWaterfallChart(props: WaterfallChartProps) {
  const { title, data = [], categories, height = 300, className, options, onChartReady, showLegend = false, showTooltip = true } = props;
  const t = buildTheme();

  let cumulative = 0;
  const baseData: number[] = [];
  const posData: (number | string)[] = [];
  const negData: (number | string)[] = [];
  for (const d of data) {
    const v = d.value;
    if (v >= 0) {
      baseData.push(cumulative);
      posData.push(v);
      negData.push('-');
    } else {
      baseData.push(cumulative + v);
      negData.push(-v);
      posData.push('-');
    }
    cumulative += v;
  }

  const cats = categories ?? data.map((d) => d.name);
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: cats },
    yAxis: { type: 'value' },
    series: [
      { type: 'bar', stack: 'total', itemStyle: { color: 'transparent' }, data: baseData, silent: true },
      { name: 'Increase', type: 'bar', stack: 'total', data: posData, itemStyle: { color: t.primary, borderRadius: [4, 4, 0, 0] } },
      { name: 'Decrease', type: 'bar', stack: 'total', data: negData, itemStyle: { color: t.destructive, borderRadius: [4, 4, 0, 0] } },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 7. Bar Label Rotation ────────────────────────────────────────── */
export interface BarLabelRotationChartProps extends BaseChartProps {
  /** Axis label rotation in degrees (default 45) */
  labelRotation?: number;
}
export function HCBarLabelRotationChart(props: BarLabelRotationChartProps) {
  const { title, categories, series, labelRotation = 45, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: {
      type: 'category',
      data: categories ?? [],
      axisLabel: { rotate: labelRotation, interval: 0, fontSize: 11 },
    },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: 40,
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontSize: 11, formatter: '{c}' },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 8. DataZoom Column (Large Scale Bar) ─────────────────────────── */
export interface DataZoomColumnChartProps extends BaseChartProps {
  /** Initial visible range start % (default 0) */
  zoomStart?: number;
  /** Initial visible range end % (default 60) */
  zoomEnd?: number;
}
export function HCDataZoomColumnChart(props: DataZoomColumnChartProps) {
  const { title, categories, series, zoomStart = 0, zoomEnd = 60, height = 320, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    dataZoom: [
      { type: 'slider', start: zoomStart, end: zoomEnd, bottom: showLegend ? 44 : 8, height: 20, labelFormatter: '' },
      { type: 'inside', start: zoomStart, end: zoomEnd },
    ],
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: 40, itemStyle: { borderRadius: [4, 4, 0, 0] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 9. Brush Column Chart ────────────────────────────────────────── */
export function HCBrushColumnChart(props: BaseChartProps) {
  const { title, categories, series, height = 320, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    brush: { toolbox: ['rect', 'clear'], xAxisIndex: 'all' },
    toolbox: {
      right: 20, top: 4,
      feature: { brush: { type: ['rect', 'clear'], title: { rect: 'Select', clear: 'Clear' } } },
    },
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: t.border, type: 'dashed' } } },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'bar', data: s.data,
      barMaxWidth: 40, itemStyle: { borderRadius: [4, 4, 0, 0] },
      emphasis: { focus: 'series' },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
