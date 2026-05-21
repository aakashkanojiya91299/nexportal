'use client';

/**
 * Mixed / Finance charts: Finance (candlestick + volume + MA + DataZoom)
 */

import React from 'react';
import type { EChartsOption } from 'echarts';
import {
  EChartsRenderer, buildTheme, PALETTE,
  type BaseChartProps,
} from './EChartsBase';

/* ── re-export types ──────────────────────────────────────────────── */
export interface FinanceChartProps extends BaseChartProps {
  /** Date/time labels for the x-axis */
  dates?: string[];
  /** OHLC per bar: [open, close, low, high] */
  ohlcData?: [number, number, number, number][];
  /** Volume values (one per bar, rendered in the bottom sub-chart) */
  volumeData?: number[];
  /** Moving-average periods to overlay, e.g. [5, 20] */
  maPeriods?: number[];
}

/* ── MA calculator ────────────────────────────────────────────────── */
function calcMA(
  data: [number, number, number, number][],
  period: number,
): (number | '-')[] {
  return data.map((_, i) => {
    if (i < period - 1) return '-';
    const sum = data
      .slice(i - period + 1, i + 1)
      .reduce((s, d) => s + d[1], 0);
    return +(sum / period).toFixed(2);
  });
}

/* ── Finance Chart ────────────────────────────────────────────────── */
export function HCFinanceChart(props: FinanceChartProps) {
  const {
    title,
    dates = [],
    ohlcData = [],
    volumeData = [],
    maPeriods = [5, 20],
    height = 520,
    className,
    options,
    onChartReady,
  } = props;

  const t = buildTheme();

  const maSeriesList = maPeriods.map((period, i) => ({
    name: `MA${period}`,
    type: 'line',
    data: calcMA(ohlcData, period),
    smooth: false,
    symbol: 'none',
    lineStyle: { width: 1.5, color: PALETTE[i + 2] },
    xAxisIndex: 0,
    yAxisIndex: 0,
  }));

  const opt: EChartsOption = {
    backgroundColor: 'transparent',
    color: PALETTE,
    animation: false,
    legend: {
      show: true, bottom: 0,
      data: maSeriesList.map((s) => s.name),
      textStyle: { color: t.muted, fontSize: 11 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: t.bg,
      borderColor: t.border,
      borderWidth: 1,
      textStyle: { color: t.text, fontSize: 12 },
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    grid: [
      { left: 60, right: 20, top: title ? 44 : 20, bottom: '36%' },
      { left: 60, right: 20, top: '67%',            bottom: 44 },
    ],
    xAxis: [
      {
        type: 'category', data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        axisLabel: { color: t.muted, fontSize: 11 },
        gridIndex: 0,
      },
      {
        type: 'category', data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        gridIndex: 1,
      },
    ],
    yAxis: [
      {
        scale: true, gridIndex: 0,
        splitLine: { lineStyle: { color: t.border, type: 'dashed' } },
        axisLabel: { color: t.muted, fontSize: 11 },
      },
      {
        scale: true, gridIndex: 1,
        splitNumber: 2,
        splitLine: { show: false },
        axisLabel: {
          color: t.muted, fontSize: 10,
          formatter: (v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : v >= 1_000
              ? `${(v / 1_000).toFixed(0)}K`
              : String(v),
        },
      },
    ],
    dataZoom: [
      { type: 'inside', xAxisIndex: [0, 1], start: 0,  end: 100 },
      { type: 'slider', xAxisIndex: [0, 1], start: 0,  end: 100, bottom: 18, height: 20, labelFormatter: '' },
    ],
    title: title
      ? { text: title, textStyle: { color: t.text, fontSize: 14, fontWeight: 600 }, left: 'left', top: 4 }
      : undefined,
    series: [
      {
        name: 'Price',
        type: 'candlestick',
        data: ohlcData,
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          color: t.primary,
          color0: t.destructive,
          borderColor: t.primary,
          borderColor0: t.destructive,
        },
      },
      ...maSeriesList,
      {
        name: 'Volume',
        type: 'bar',
        data: volumeData.map((v, i) => ({
          value: v,
          itemStyle: {
            color:
              ohlcData[i] && ohlcData[i][1] >= ohlcData[i][0]
                ? t.primary
                : t.destructive,
            opacity: 0.7,
          },
        })),
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 20,
      },
    ] as EChartsOption['series'],
  };

  return (
    <EChartsRenderer
      baseOption={opt}
      override={options}
      height={height}
      className={className}
      onChartReady={onChartReady}
      watermark={props.watermark}
      showDownload={props.showDownload}
    />
  );
}
