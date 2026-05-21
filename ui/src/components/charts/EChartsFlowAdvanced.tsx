'use client';

/**
 * Flow & advanced charts: Graph (network), Sankey, Parallel,
 * ThemeRiver, PictorialBar
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme, PALETTE,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface GraphNode {
  id: string; name: string; value?: number;
  category?: number; symbolSize?: number;
}
export interface GraphLink { source: string; target: string; value?: number }
export interface GraphChartProps extends BaseChartProps {
  nodes?: GraphNode[];
  links?: GraphLink[];
  nodeCategories?: Array<{ name: string }>;
  layout?: 'force' | 'circular' | 'none';
}
export interface SankeyNode { name: string }
export interface SankeyLink { source: string; target: string; value: number }
export interface SankeyChartProps extends BaseChartProps {
  sankeyNodes?: SankeyNode[];
  sankeyLinks?: SankeyLink[];
}
export interface ParallelDimension { name: string; max?: number; min?: number }
export interface ParallelChartProps extends BaseChartProps {
  dimensions?: ParallelDimension[];
  parallelSeries?: Array<{ name: string; data: number[][] }>;
}
export interface ThemeRiverChartProps extends BaseChartProps {
  /** Each item: [date-string, value, stream-name] */
  riverData?: Array<[string, number, string]>;
}
export interface PictorialBarChartProps extends BaseChartProps {
  /** SVG path or built-in: 'circle','rect','roundRect','triangle','diamond','pin','arrow' */
  symbol?: string;
}

/* ── 1. Graph / Network ───────────────────────────────────────────── */
export function HCGraphChart(props: GraphChartProps) {
  const { title, nodes = [], links = [], nodeCategories = [], layout = 'force', height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, nodeCategories.length > 0 && showLegend, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}' },
    legend: nodeCategories.length > 0
      ? { show: showLegend, bottom: 0, data: nodeCategories.map((c) => c.name) }
      : { show: false },
    series: [
      {
        type: 'graph', layout,
        data: nodes.map((n) => ({ id: n.id, name: n.name, value: n.value, category: n.category, symbolSize: n.symbolSize ?? 20 })),
        links: links.map((l) => ({ source: l.source, target: l.target, value: l.value })),
        categories: nodeCategories,
        roam: true,
        label: { show: true, position: 'right', formatter: '{b}', fontSize: 11 },
        force: { repulsion: 100, edgeLength: [50, 120] },
        lineStyle: { opacity: 0.9, width: 1.5, curveness: 0 },
        emphasis: { focus: 'adjacency', lineStyle: { width: 4 } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Sankey ────────────────────────────────────────────────────── */
export function HCSankeyChart(props: SankeyChartProps) {
  const { title, sankeyNodes = [], sankeyLinks = [], height = 300, className, options, onChartReady, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: {
      trigger: 'item',
      formatter: (p: unknown) => {
        const params = p as { dataType: string; data: { source?: string; target?: string; value?: number; name?: string } };
        if (params.dataType === 'edge') return `${params.data.source} → ${params.data.target}: ${params.data.value}`;
        return params.data.name ?? '';
      },
    },
    series: [
      {
        type: 'sankey', data: sankeyNodes, links: sankeyLinks,
        nodeWidth: 20, nodeGap: 8,
        lineStyle: { opacity: 0.3, curveness: 0.5 },
        label: { color: t.text, fontSize: 11 },
        emphasis: { focus: 'adjacency', lineStyle: { opacity: 0.7 } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Parallel Coordinates ──────────────────────────────────────── */
export function HCParallelChart(props: ParallelChartProps) {
  const { title, dimensions = [], parallelSeries = [], height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    parallelAxis: dimensions.map((dim, i) => ({
      dim: i, name: dim.name,
      ...(dim.max !== undefined ? { max: dim.max } : {}),
      ...(dim.min !== undefined ? { min: dim.min } : {}),
      nameTextStyle: { color: t.muted, fontSize: 11 },
      axisLine: { lineStyle: { color: t.border } },
      axisTick: { lineStyle: { color: t.border } },
      axisLabel: { color: t.muted, fontSize: 10 },
    })),
    parallel: { left: 40, right: 40, bottom: showLegend ? 50 : 20, top: title ? 50 : 20 },
    tooltip: { trigger: 'item' },
    series: parallelSeries.map((s, i) => ({
      name: s.name, type: 'parallel',
      lineStyle: { width: 1.5, opacity: 0.5, color: PALETTE[i % PALETTE.length] },
      data: s.data,
      emphasis: { lineStyle: { width: 3, opacity: 1 } },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 4. Theme River ───────────────────────────────────────────────── */
export function HCThemeRiverChart(props: ThemeRiverChartProps) {
  const { title, riverData = [], height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const t = buildTheme();
  const streams = Array.from(new Set(riverData.map((d) => d[2])));
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    singleAxis: {
      top: title ? 60 : 30, bottom: showLegend ? 50 : 20,
      axisTick: {},
      axisLabel: { color: t.muted, fontSize: 11 },
      type: 'time',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: t.border, type: 'dashed' } },
    },
    legend: showLegend
      ? { show: true, bottom: 0, data: streams, textStyle: { color: t.muted } }
      : { show: false },
    series: [
      {
        type: 'themeRiver', data: riverData,
        label: { show: false },
        emphasis: { label: { show: true, fontSize: 11 } },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 5. Pictorial Bar ─────────────────────────────────────────────── */
export function HCPictorialBarChart(props: PictorialBarChartProps) {
  const { title, categories, series, symbol = 'circle', height = 300, className, options, onChartReady, showLegend = true, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, showLegend, showTooltip),
    xAxis: { type: 'category', data: categories ?? [] },
    yAxis: { type: 'value' },
    series: (series ?? []).map((s, i) => ({
      name: s.name, type: 'pictorialBar',
      symbol, symbolSize: ['80%', '80%'],
      symbolRepeat: true, symbolMargin: '5%',
      data: s.data,
      itemStyle: { color: PALETTE[i % PALETTE.length] },
    })),
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
