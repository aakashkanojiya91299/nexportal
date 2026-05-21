'use client';

/**
 * Hierarchical charts: Treemap, Tree diagram, Sunburst
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, baseOption, buildTheme,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface TreemapItem { name: string; value: number; children?: TreemapItem[] }
export interface TreemapChartProps extends BaseChartProps {
  treeData?: TreemapItem[];
}
export interface TreeNode {
  name: string;
  value?: number;
  children?: TreeNode[];
}
export interface TreeChartProps extends BaseChartProps {
  treeData?: TreeNode;
  layout?: 'orthogonal' | 'radial';
  orient?: 'LR' | 'RL' | 'TB' | 'BT';
}
export interface SunburstItem {
  name: string;
  value?: number;
  children?: SunburstItem[];
}
export interface SunburstChartProps extends BaseChartProps {
  sunburstData?: SunburstItem[];
}

/* ── 1. Treemap ───────────────────────────────────────────────────── */
export function HCTreemapChart(props: TreemapChartProps) {
  const { title, treeData = [], height = 300, className, options, onChartReady, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'treemap',
        data: treeData,
        roam: false,
        itemStyle: { gapWidth: 2, borderWidth: 1 },
        label: { show: true, formatter: '{b}' },
        breadcrumb: { show: false },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 2. Tree Diagram ──────────────────────────────────────────────── */
export function HCTreeChart(props: TreeChartProps) {
  const { title, treeData, layout = 'orthogonal', orient = 'LR', height = 300, className, options, onChartReady, showTooltip = true } = props;
  const t = buildTheme();
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'tree',
        data: treeData ? [treeData] : [],
        layout, orient,
        symbol: 'emptyCircle', symbolSize: 7,
        initialTreeDepth: 3,
        lineStyle: { color: t.border, width: 1.5, curveness: 0.5 },
        label: {
          position: 'left', verticalAlign: 'middle',
          align: 'right', fontSize: 11, color: t.text,
        },
        leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}

/* ── 3. Sunburst ──────────────────────────────────────────────────── */
export function HCSunburstChart(props: SunburstChartProps) {
  const { title, sunburstData = [], height = 300, className, options, onChartReady, showTooltip = true } = props;
  const opt: EChartsOption = {
    ...baseOption(title, false, showTooltip),
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'sunburst',
        data: sunburstData,
        radius: ['15%', '80%'],
        label: { show: true, fontSize: 11 },
        itemStyle: { borderWidth: 2 },
        emphasis: { focus: 'ancestor' },
      },
    ],
  };
  return <EChartsRenderer baseOption={opt} override={options} height={height} className={className} onChartReady={onChartReady} watermark={props.watermark} showDownload={props.showDownload} />;
}
