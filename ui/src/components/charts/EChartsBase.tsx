'use client';

/**
 * Shared base: lazy loader, theme helpers, types, skeleton, renderer.
 * Imported by every HC* chart file — not exported from the package directly.
 */

import React, {
  lazy,
  Suspense,
  useMemo,
  type CSSProperties,
} from 'react';
import type { EChartsOption, ECharts as EChartsInstance } from 'echarts';
import { cn } from '../../lib/cn';

/* ── Lazy-load echarts-for-react ──────────────────────────────────── */
export const ReactECharts = lazy(() => import('echarts-for-react'));

/* ── CSS-variable theme ───────────────────────────────────────────── */
export function getCSSVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

export function buildTheme() {
  return {
    primary:     getCSSVar('--primary',           '#6366f1'),
    accent:      getCSSVar('--accent',            '#8b5cf6'),
    success:     getCSSVar('--success',           '#22c55e'),
    warning:     getCSSVar('--warning',           '#f59e0b'),
    destructive: getCSSVar('--destructive',       '#ef4444'),
    muted:       getCSSVar('--muted-foreground',  '#94a3b8'),
    border:      getCSSVar('--border',            '#e2e8f0'),
    bg:          getCSSVar('--card',              '#ffffff'),
    text:        getCSSVar('--foreground',        '#0f172a'),
  };
}

export const PALETTE = [
  '#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#10b981', '#f97316', '#3b82f6',
];

/* ── Shared types ─────────────────────────────────────────────────── */
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: (number | null)[];
  color?: string;
}

export interface BaseChartProps {
  title?: string;
  categories?: string[];
  series?: ChartSeries[];
  data?: ChartDataPoint[];
  height?: number | string;
  className?: string;
  options?: EChartsOption;
  onChartReady?: (chart: EChartsInstance) => void;
  showLegend?: boolean;
  showTooltip?: boolean;
  /** Semi-transparent diagonal text overlaid on the chart */
  watermark?: string;
  /** Show a save-as-PNG button in the top-right corner */
  showDownload?: boolean;
}

/* ── Skeleton loader ──────────────────────────────────────────────── */
export function ChartSkeleton({
  height,
  className,
}: {
  height: number | string;
  className?: string;
}) {
  const style: CSSProperties =
    typeof height === 'number' ? { height } : { height };
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-muted/40 flex items-center justify-center',
        className,
      )}
      style={style}
    >
      <svg className="text-muted/60 w-12 h-12" fill="none" viewBox="0 0 48 48">
        <rect x="4"  y="28" width="8" height="16" rx="2" fill="currentColor" opacity=".5" />
        <rect x="16" y="18" width="8" height="26" rx="2" fill="currentColor" opacity=".65" />
        <rect x="28" y="8"  width="8" height="36" rx="2" fill="currentColor" opacity=".8" />
        <rect x="40" y="22" width="8" height="22" rx="2" fill="currentColor" opacity=".6" />
      </svg>
    </div>
  );
}

/* ── Core renderer ────────────────────────────────────────────────── */
interface RendererProps {
  baseOption: EChartsOption;
  override?: EChartsOption;
  height: number | string;
  className?: string;
  onChartReady?: (chart: EChartsInstance) => void;
  watermark?: string;
  showDownload?: boolean;
}

export function EChartsRenderer({
  baseOption: base,
  override,
  height,
  className,
  onChartReady,
  watermark,
  showDownload,
}: RendererProps) {
  const style: CSSProperties =
    typeof height === 'number' ? { height } : { height };

  const merged: EChartsOption = useMemo(() => {
    let opt = deepMerge(base, override ?? {});
    if (showDownload) {
      opt = deepMerge(opt, {
        toolbox: { right: 20, top: 4, feature: { saveAsImage: { title: 'Save', pixelRatio: 2 } } },
      } as EChartsOption);
    }
    if (watermark) {
      (opt as Record<string, unknown>).graphic = [{
        type: 'text', left: 'center', top: 'middle', z: 100,
        style: { text: watermark, fill: 'rgba(0,0,0,0.06)', fontSize: 40, fontWeight: 700, rotate: -30 },
      }];
    }
    return opt;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(base), JSON.stringify(override), watermark, showDownload]);

  return (
    <Suspense fallback={<ChartSkeleton height={height} className={className} />}>
      <ReactECharts
        option={merged}
        style={{ width: '100%', ...style }}
        className={className}
        onChartReady={onChartReady as never}
        opts={{ renderer: 'svg' }}
        notMerge
        lazyUpdate
      />
    </Suspense>
  );
}

/* ── Deep-merge helper ────────────────────────────────────────────── */
export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const out = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source) as (keyof T)[]) {
    const s = source[key];
    const t = target[key];
    if (
      s !== null && typeof s === 'object' && !Array.isArray(s) &&
      t !== null && typeof t === 'object' && !Array.isArray(t)
    ) {
      out[key as string] = deepMerge(t as object, s as object);
    } else {
      out[key as string] = s;
    }
  }
  return out as T;
}

/* ── Shared base-option factory ───────────────────────────────────── */
export function baseOption(
  title?: string,
  showLegend = true,
  showTooltip = true,
): EChartsOption {
  const t = buildTheme();
  return {
    backgroundColor: 'transparent',
    textStyle: { color: t.text, fontFamily: 'inherit' },
    title: title
      ? { text: title, textStyle: { color: t.text, fontSize: 14, fontWeight: 600 }, left: 'left', top: 4 }
      : undefined,
    color: PALETTE,
    legend: showLegend
      ? { show: true, bottom: 0, textStyle: { color: t.muted }, icon: 'circle', itemWidth: 8, itemHeight: 8 }
      : { show: false },
    tooltip: showTooltip
      ? { trigger: 'axis', backgroundColor: t.bg, borderColor: t.border, borderWidth: 1, textStyle: { color: t.text, fontSize: 12 } }
      : { show: false },
    grid: {
      top: title ? 40 : 12,
      left: 8,
      right: 8,
      bottom: showLegend ? 40 : 12,
      containLabel: true,
    },
  };
}
