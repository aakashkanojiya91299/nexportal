/**
 * Generates /dashboard/charts — full showcase of all 40 Apache ECharts
 * chart types from @lucifer91299/ui, grouped into 13 sections.
 */
export function genChartsShowcasePage(): string {
  return `'use client'

import {
  HCLineChart, HCSplineChart, HCStepLineChart, HCStackedLineChart,
  HCAreaChart, HCAreaSplineChart, HCStackedAreaChart, HCAreaRangeChart,
  HCColumnChart, HCBarChart, HCStackedColumnChart, HCStackedBarChart,
  HCColumnRangeChart, HCWaterfallChart,
  HCBarLabelRotationChart, HCDataZoomColumnChart, HCBrushColumnChart,
  HCFinanceChart,
  HCPieChart, HCDonutChart, HCNightingaleChart, HCFunnelChart,
  HCScatterChart, HCEffectScatterChart, HCBubbleChart, HCBoxPlotChart,
  HCCandlestickChart,
  HCGaugeChart, HCSolidGaugeChart,
  HCHeatmapChart, HCCalendarHeatmapChart,
  HCTreemapChart, HCTreeChart, HCSunburstChart,
  HCGraphChart, HCSankeyChart,
  HCParallelChart, HCThemeRiverChart, HCPictorialBarChart,
  HCPolarChart,
  PageShell,
} from '@lucifer91299/ui'

${genChartsData()}

${genChartHelpers()}

${genChartsPageBody()}
`
}

/* ── sample data fragment ─────────────────────────────────────────── */
function genChartsData(): string {
  return `/* ── sample data ─────────────────────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const REV = [
  { name: 'Revenue',  data: [420,550,490,610,730,680,800,760,840,920,870,1010] },
  { name: 'Expenses', data: [280,310,270,340,390,360,420,400,450,480,460,520] },
]
const CATS5  = ['Product A','Product B','Product C','Product D','Product E']
const VALS5  = [{ name: 'Sales', data: [820,650,480,370,260] }]
const MULTI  = [
  { name: 'Q1', data: [120,200,150,80,70] },
  { name: 'Q2', data: [160,240,190,110,90] },
  { name: 'Q3', data: [100,180,130,95,60] },
]
const PIE = [
  { name: 'Direct', value: 38 }, { name: 'Organic', value: 27 },
  { name: 'Referral', value: 18 }, { name: 'Social', value: 12 }, { name: 'Email', value: 5 },
]
const FUNNEL = [
  { name: 'Visitors', value: 10000 }, { name: 'Leads', value: 4200 },
  { name: 'Prospects', value: 1800 }, { name: 'Qualified', value: 720 },
  { name: 'Closed', value: 240 },
]
const SC = [
  { name: 'Group A', data: [[14,3],[16,5],[18,7],[12,4],[20,9]] as [number,number][] },
  { name: 'Group B', data: [[30,11],[28,9],[32,13],[26,8],[34,15]] as [number,number][] },
]
const BUBBLE = [{ name: 'Campaigns', data: [[10,20,30],[20,35,50],[40,45,60],[60,55,75]] as [number,number,number][] }]
const RADAR_IND = ['Speed','Strength','Agility','Endurance','Technique','Tactics']
const RADAR_S   = [{ name: 'Athlete A', data: [82,91,74,88,79,85] }, { name: 'Athlete B', data: [68,78,90,72,84,76] }]
const HM_X = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HM_Y = ['00:00','06:00','09:00','12:00','15:00','18:00','21:00']
const HM_D: [number,number,number][] = Array.from({length:49},(_,i)=>[i%7,Math.floor(i/7),Math.round(Math.random()*100)])
const TREE_D = { name:'CEO', children:[
  { name:'CTO', children:[{ name:'Engineering', children:[{name:'Frontend'},{name:'Backend'}]},{name:'DevOps'}]},
  { name:'CMO', children:[{name:'Marketing'},{name:'Sales'}]},
]}
const SB_D = [
  { name:'Tech',    value:400, children:[{name:'Frontend',value:150,children:[{name:'React',value:80},{name:'Vue',value:70}]},{name:'Backend',value:130},{name:'DevOps',value:120}]},
  { name:'Business',value:300, children:[{name:'Sales',value:160},{name:'Marketing',value:140}]},
]
const CAL_D: [string,number][] = Array.from({length:200},(_,i)=>{
  const d = new Date(2024,0,i+1); return [d.toISOString().slice(0,10), Math.round(Math.random()*100)]
})
const G_NODES = [
  {id:'1',name:'Node A',symbolSize:30,category:0},{id:'2',name:'Node B',symbolSize:25,category:0},
  {id:'3',name:'Node C',symbolSize:20,category:1},{id:'4',name:'Node D',symbolSize:20,category:1},
  {id:'5',name:'Node E',symbolSize:15,category:2},{id:'6',name:'Node F',symbolSize:15,category:2},
]
const G_LINKS = [{source:'1',target:'2'},{source:'1',target:'3'},{source:'2',target:'4'},{source:'3',target:'5'},{source:'4',target:'6'}]
const G_CATS  = [{name:'Group A'},{name:'Group B'},{name:'Group C'}]
const SK_N = [{name:'Visitors'},{name:'Direct'},{name:'Referral'},{name:'Search'},{name:'Signup'},{name:'Purchase'},{name:'Bounce'}]
const SK_L = [
  {source:'Visitors',target:'Direct',value:4000},{source:'Visitors',target:'Referral',value:2500},
  {source:'Visitors',target:'Search',value:3500},{source:'Direct',target:'Signup',value:1800},
  {source:'Direct',target:'Bounce',value:2200},{source:'Signup',target:'Purchase',value:2800},
]
const PAR_D = [{name:'Speed',max:100},{name:'Strength',max:100},{name:'Agility',max:100},{name:'Endurance',max:100},{name:'Technique',max:100}]
const PAR_S = [
  { name:'Athlete A', data:[[82,91,74,88,79],[75,85,80,82,88]] },
  { name:'Athlete B', data:[[68,78,90,72,84],[72,80,95,68,78]] },
]
const RIV_D: [string,number,string][] = [
  ['2024-01',300,'A'],['2024-02',420,'A'],['2024-03',380,'A'],['2024-04',510,'A'],
  ['2024-01',200,'B'],['2024-02',260,'B'],['2024-03',240,'B'],['2024-04',310,'B'],
  ['2024-01',150,'C'],['2024-02',180,'C'],['2024-03',220,'C'],['2024-04',190,'C'],
]
const OHLC_C = ['Mon','Tue','Wed','Thu','Fri','Sat','Mon','Tue','Wed','Thu']
const OHLC_D: [number,number,number,number][] = [
  [85,88,83,90],[88,82,80,89],[82,86,81,87],[86,90,85,92],
  [90,87,86,91],[87,89,85,90],[89,93,88,94],[93,91,89,94],
  [91,95,90,96],[95,92,91,96],
]
const AR_C = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const AR_S = [{ name:'Avg Temp', data:[18,21,19,24,22,17,20] }]
const AR_B = [{ name:'Temp Range', data:[[14,23],[17,25],[15,24],[20,28],[18,27],[12,21],[15,25]] as [number,number][] }]
const CR_C = ['Week 1','Week 2','Week 3','Week 4']
const CR_B = [{ name:'Min–Max', data:[[20,40],[35,60],[28,55],[42,70]] as [number,number][] }]
const BOX_D = [[12,25,32,46,58],[8,22,31,44,62],[15,28,38,52,68],[10,20,28,40,55]]
const BOX_C = ['Q1','Q2','Q3','Q4']
const OUT: [number,number][] = [[0,5],[1,72],[2,78],[3,3]]
const TM_D = [
  { name:'Engineering',value:320,children:[{name:'Frontend',value:130},{name:'Backend',value:110},{name:'DevOps',value:80}]},
  { name:'Marketing',  value:210,children:[{name:'SEO',value:90},{name:'Ads',value:70},{name:'Content',value:50}]},
  { name:'Sales',      value:180,children:[{name:'Inbound',value:100},{name:'Outbound',value:80}]},
  { name:'Support',    value:120 }, { name:'Finance', value:90 },
]
const WF_D = [
  {name:'Q1 Start',value:400},{name:'Revenue',value:580},{name:'COGS',value:-220},
  {name:'OpEx',value:-140},{name:'Tax',value:-60},{name:'Net Q1',value:0},
]
const MANY_CATS = ['Jan 23','Feb 23','Mar 23','Apr 23','May 23','Jun 23','Jul 23','Aug 23','Sep 23','Oct 23','Nov 23','Dec 23','Jan 24','Feb 24','Mar 24','Apr 24','May 24','Jun 24']
const MANY_SERIES = [{ name:'Revenue', data: MANY_CATS.map((_,i)=>Math.round(300+i*30+Math.random()*150)) }]
const FIN_DATES = Array.from({length:60},(_,i)=>{const d=new Date(2002,0,i+1);return d.toISOString().slice(0,10)})
const FIN_OHLC: [number,number,number,number][] = (() => {
  let p = 150
  return FIN_DATES.map(()=>{
    const o=+(p+(Math.random()-0.5)*6).toFixed(2)
    const c=+(o+(Math.random()-0.5)*8).toFixed(2)
    const h=+(Math.max(o,c)+(Math.random()*4)).toFixed(2)
    const l=+(Math.min(o,c)-(Math.random()*4)).toFixed(2)
    p=c; return [o,c,l,h]
  })
})()
const FIN_VOL = FIN_OHLC.map(()=>Math.round(500000+Math.random()*2000000))`
}

/* ── helper components fragment ───────────────────────────────────── */
function genChartHelpers(): string {
  return `/* ── helper components ────────────────────────────────────────────── */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4">
      <h2 className="text-base font-semibold text-foreground border-b border-separator pb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </section>
  )
}
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-separator shadow-sm p-4 space-y-2">
      <p className="text-xs font-medium text-label-secondary uppercase tracking-wide">{title}</p>
      {children}
    </div>
  )
}`
}

/* ── page body fragment ───────────────────────────────────────────── */
function genChartsPageBody(): string {
  return `/* ── page ─────────────────────────────────────────────────────────── */
export default function ChartsShowcasePage() {
  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      <PageShell title="Charts Showcase" subtitle="All 40 chart types — Apache ECharts (Apache-2.0)" />

      <Section id="line" title="1 · Line Charts">
        <ChartCard title="Line"><HCLineChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Spline"><HCSplineChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Step Line"><HCStepLineChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Stacked Line"><HCStackedLineChart categories={MONTHS} series={REV} height={240} /></ChartCard>
      </Section>

      <Section id="area" title="2 · Area Charts">
        <ChartCard title="Area"><HCAreaChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Area Spline"><HCAreaSplineChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Stacked Area"><HCStackedAreaChart categories={MONTHS} series={REV} height={240} /></ChartCard>
        <ChartCard title="Area Range"><HCAreaRangeChart categories={AR_C} series={AR_S} rangeSeries={AR_B} height={240} /></ChartCard>
      </Section>

      <Section id="bar" title="3 · Bar &amp; Column">
        <ChartCard title="Column"><HCColumnChart categories={CATS5} series={VALS5} height={240} /></ChartCard>
        <ChartCard title="Bar"><HCBarChart categories={CATS5} series={VALS5} height={240} /></ChartCard>
        <ChartCard title="Stacked Column"><HCStackedColumnChart categories={CATS5} series={MULTI} height={240} /></ChartCard>
        <ChartCard title="Stacked Bar"><HCStackedBarChart categories={CATS5} series={MULTI} height={240} /></ChartCard>
        <ChartCard title="Column Range"><HCColumnRangeChart categories={CR_C} rangeSeries={CR_B} height={240} /></ChartCard>
        <ChartCard title="Waterfall"><HCWaterfallChart data={WF_D} height={240} /></ChartCard>
        <ChartCard title="Bar Label Rotation"><HCBarLabelRotationChart categories={MONTHS} series={REV} labelRotation={45} height={260} /></ChartCard>
        <ChartCard title="DataZoom Column"><HCDataZoomColumnChart categories={MANY_CATS} series={MANY_SERIES} zoomStart={0} zoomEnd={60} height={260} /></ChartCard>
        <ChartCard title="Brush Select Column"><HCBrushColumnChart categories={MONTHS} series={REV} height={260} /></ChartCard>
      </Section>

      <Section id="finance" title="3b · Finance Chart">
        <div className="col-span-full">
          <ChartCard title="Finance / Candlestick + Volume + MA">
            <HCFinanceChart dates={FIN_DATES} ohlcData={FIN_OHLC} volumeData={FIN_VOL} maPeriods={[5,20]} height={520} showDownload />
          </ChartCard>
        </div>
      </Section>

      <Section id="pie" title="4 · Pie, Donut, Rose &amp; Funnel">
        <ChartCard title="Pie"><HCPieChart data={PIE} height={260} /></ChartCard>
        <ChartCard title="Donut"><HCDonutChart data={PIE} height={260} /></ChartCard>
        <ChartCard title="Nightingale / Rose"><HCNightingaleChart data={PIE} height={260} /></ChartCard>
        <ChartCard title="Funnel"><HCFunnelChart data={FUNNEL} height={280} /></ChartCard>
      </Section>

      <Section id="scatter" title="5 · Scatter, Bubble &amp; Box Plot">
        <ChartCard title="Scatter"><HCScatterChart series={SC} height={260} /></ChartCard>
        <ChartCard title="Effect Scatter"><HCEffectScatterChart series={SC} height={260} /></ChartCard>
        <ChartCard title="Bubble"><HCBubbleChart series={BUBBLE} height={260} /></ChartCard>
        <ChartCard title="Box Plot"><HCBoxPlotChart categories={BOX_C} boxData={BOX_D} outliers={OUT} height={260} /></ChartCard>
      </Section>

      <Section id="candlestick" title="6 · Candlestick / K-Line">
        <ChartCard title="Candlestick (OHLC)"><HCCandlestickChart categories={OHLC_C} ohlcData={OHLC_D} height={280} /></ChartCard>
      </Section>

      <Section id="gauge" title="7 · Gauges">
        <ChartCard title="Angular Gauge"><HCGaugeChart title="Server Load" value={72} min={0} max={100} units="%" height={280} /></ChartCard>
        <ChartCard title="Solid Gauge"><HCSolidGaugeChart title="Completion" value={68} min={0} max={100} units="%" height={280} /></ChartCard>
      </Section>

      <Section id="heatmap" title="8 · Heatmap &amp; Calendar">
        <ChartCard title="Cartesian Heatmap"><HCHeatmapChart xCategories={HM_X} yCategories={HM_Y} heatData={HM_D} height={300} /></ChartCard>
        <ChartCard title="Calendar Heatmap"><HCCalendarHeatmapChart year={2024} calData={CAL_D} height={200} /></ChartCard>
      </Section>

      <Section id="hierarchy" title="9 · Treemap, Tree &amp; Sunburst">
        <ChartCard title="Treemap"><HCTreemapChart treeData={TM_D} height={300} /></ChartCard>
        <ChartCard title="Tree Diagram"><HCTreeChart treeData={TREE_D} orient="LR" height={300} /></ChartCard>
        <ChartCard title="Sunburst"><HCSunburstChart sunburstData={SB_D} height={300} /></ChartCard>
      </Section>

      <Section id="graph" title="10 · Graph &amp; Sankey">
        <ChartCard title="Force Graph"><HCGraphChart nodes={G_NODES} links={G_LINKS} nodeCategories={G_CATS} layout="force" height={320} /></ChartCard>
        <ChartCard title="Sankey"><HCSankeyChart sankeyNodes={SK_N} sankeyLinks={SK_L} height={320} /></ChartCard>
      </Section>

      <Section id="advanced" title="11 · Parallel, Theme River &amp; Pictorial">
        <ChartCard title="Parallel Coordinates"><HCParallelChart dimensions={PAR_D} parallelSeries={PAR_S} height={300} /></ChartCard>
        <ChartCard title="Theme River"><HCThemeRiverChart riverData={RIV_D} height={300} /></ChartCard>
        <ChartCard title="Pictorial Bar"><HCPictorialBarChart categories={CATS5} series={VALS5} symbol="circle" height={280} /></ChartCard>
      </Section>

      <Section id="radar" title="12 · Radar / Polar">
        <ChartCard title="Radar"><HCPolarChart indicators={RADAR_IND} series={RADAR_S} height={300} /></ChartCard>
      </Section>
    </div>
  )
}`
}
