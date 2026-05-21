'use client';

/**
 * Barrel re-export for all Apache ECharts (Apache-2.0) chart components.
 *
 * Files:
 *   EChartsBase.tsx          shared theme, types, renderer
 *   EChartsLine.tsx          Line, Spline, StepLine, StackedLine, Area, AreaSpline, StackedArea, AreaRange
 *   EChartsBar.tsx           Column, Bar, StackedColumn, StackedBar, ColumnRange, Waterfall
 *   EChartsPie.tsx           Pie, Donut, Nightingale, Funnel, Polar/Radar
 *   EChartsScatter.tsx       Scatter, EffectScatter, Bubble, BoxPlot, Candlestick
 *   EChartsGaugeHeatmap.tsx  Gauge, SolidGauge, Heatmap, CalendarHeatmap
 *   EChartsHierarchy.tsx     Treemap, Tree, Sunburst
 *   EChartsFlowAdvanced.tsx  Graph, Sankey, Parallel, ThemeRiver, PictorialBar
 *
 * Peer deps: npm install echarts echarts-for-react
 */

export type { ChartDataPoint, ChartSeries, BaseChartProps } from './EChartsBase';

export {
  HCLineChart, HCSplineChart, HCStepLineChart, HCStackedLineChart,
  HCAreaChart, HCAreaSplineChart, HCStackedAreaChart, HCAreaRangeChart,
} from './EChartsLine';
export type { AreaRangeChartProps, StepLineChartProps } from './EChartsLine';

export {
  HCColumnChart, HCBarChart, HCStackedColumnChart, HCStackedBarChart,
  HCColumnRangeChart, HCWaterfallChart,
  HCBarLabelRotationChart, HCDataZoomColumnChart, HCBrushColumnChart,
} from './EChartsBar';
export type {
  ColumnRangeChartProps, WaterfallChartProps,
  BarLabelRotationChartProps, DataZoomColumnChartProps,
} from './EChartsBar';

export { HCFinanceChart } from './EChartsMixed';
export type { FinanceChartProps } from './EChartsMixed';

export {
  HCPieChart, HCDonutChart, HCNightingaleChart, HCFunnelChart, HCPolarChart,
} from './EChartsPie';
export type { PolarChartProps } from './EChartsPie';

export {
  HCScatterChart, HCEffectScatterChart, HCBubbleChart,
  HCBoxPlotChart, HCCandlestickChart,
} from './EChartsScatter';
export type {
  ScatterChartProps, EffectScatterChartProps, BubbleChartProps,
  BoxPlotChartProps, CandlestickChartProps,
} from './EChartsScatter';

export {
  HCGaugeChart, HCSolidGaugeChart, HCHeatmapChart, HCCalendarHeatmapChart,
} from './EChartsGaugeHeatmap';
export type {
  GaugeChartProps, HeatmapChartProps, CalendarHeatmapChartProps,
} from './EChartsGaugeHeatmap';

export {
  HCTreemapChart, HCTreeChart, HCSunburstChart,
} from './EChartsHierarchy';
export type {
  TreemapItem, TreemapChartProps, TreeNode, TreeChartProps,
  SunburstItem, SunburstChartProps,
} from './EChartsHierarchy';

export {
  HCGraphChart, HCSankeyChart, HCParallelChart,
  HCThemeRiverChart, HCPictorialBarChart,
} from './EChartsFlowAdvanced';
export type {
  GraphNode, GraphLink, GraphChartProps,
  SankeyNode, SankeyLink, SankeyChartProps,
  ParallelDimension, ParallelChartProps,
  ThemeRiverChartProps, PictorialBarChartProps,
} from './EChartsFlowAdvanced';
