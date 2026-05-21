'use client';

/**
 * Statistical charts: Scatter, EffectScatter, Bubble, BoxPlot, Candlestick
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface ScatterChartProps extends Omit<BaseChartProps, 'series'> {
  series?: Array<{ name: string; data: [number, number][]; color?: string }>;
}
export interface EffectScatterChartProps extends Omit<BaseChartProps, 'series'> {
  series?: Array<{ name: string; data: [number, number][]; color?: string }>;
}
export interface BubbleChartProps extends Omit<BaseChartProps, 'series'> {
  series?: Array<{ name: string; data: [number, number, number][]; color?: string }>;
}
export interface BoxPlotChartProps extends BaseChartProps {
  boxData?: number[][];
  outliers?: [number, number][];
}
export interface CandlestickChartProps extends BaseChartProps {
  /** Each entry: [open, close, low, high] */
  ohlcData?: [number, number, number, number][];
}

/* ── 1. Scatter ───────────────────────────────────────────────────── */
export function HCScatterChart(props: ScatterChartProps) {
  const { title, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value', scale: true },
    yAxis: { type: 'value', scale: true },
    tooltip: { trigger: 'item' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'scatter', data: s.data, symbolSize: 10,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Effect Scatter (ripple animation) ─────────────────────────── */
export function HCEffectScatterChart(props: EffectScatterChartProps) {
  const { title, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value', scale: true },
    yAxis: { type: 'value', scale: true },
    tooltip: { trigger: 'item' },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'effectScatter', data: s.data,
      symbolSize: 12,
      rippleEffect: { brushType: 'stroke', scale: 3 },
      showEffectOn: 'render',
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Bubble ────────────────────────────────────────────────────── */
export function HCBubbleChart(props: BubbleChartProps) {
  const { title, series, height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'value', scale: true },
    yAxis: { type: 'value', scale: true },
    tooltip: {
      trigger: 'item',
      formatter: (p: unknown) => {
        const params = p as { seriesName: string; value: [number, number, number] };
        return `${params.seriesName}<br/>x: ${params.value[0]}, y: ${params.value[1]}, size: ${params.value[2]}`;
      },
    },
    series: (series ?? []).map((s) => ({
      name: s.name, type: 'scatter', data: s.data,
      symbolSize: (val: [number, number, number]) => Math.sqrt(val[2]) * 2,
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Box Plot ──────────────────────────────────────────────────── */
export function HCBoxPlotChart(props: BoxPlotChartProps) {
  const { title, categories, boxData = [], outliers = [], height = 300, className, options, onChartReady, showLegend = false, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? boxData.map((_, i) => `Q${i + 1}`), boundaryGap: true },
    yAxis: { type: 'value', splitArea: { show: true } },
    series: [
      {
        name: 'Distribution', type: 'boxplot', data: boxData,
        itemStyle: { color: t.primary, borderColor: t.accent },
      },
      {
        name: 'Outliers', type: 'scatter', data: outliers,
        itemStyle: { color: t.destructive }, symbolSize: 7,
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 5. Candlestick / K-Line ──────────────────────────────────────── */
export function HCCandlestickChart(props: CandlestickChartProps) {
  const { title, categories, ohlcData = [], height = 300, className, options, onChartReady, showLegend = false, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: {
      type: 'category',
      data: categories ?? ohlcData.map((_, i) => `Day ${i + 1}`),
      boundaryGap: true,
    },
    yAxis: { type: 'value', scale: true, splitLine: { lineStyle: { color: t.border, type: 'dashed' } } },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: unknown) => {
        const p = (params as Array<{ name: string; value: [number, number, number, number] }>)[0];
        if (!p) return '';
        const [o, c, l, h] = p.value;
        return `${p.name}<br/>Open: ${o}<br/>Close: ${c}<br/>Low: ${l}<br/>High: ${h}`;
      },
    },
    series: [
      {
        type: 'candlestick',
        data: ohlcData,
        itemStyle: {
          color: t.primary,
          color0: t.destructive,
          borderColor: t.primary,
          borderColor0: t.destructive,
        },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
