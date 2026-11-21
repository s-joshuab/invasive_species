import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Filter,
  MapPin,
  ScanLine,
  Sprout,
  Trees,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { MapView } from '../components/MapView'
import { Legend } from '../components/Legend'
import { ChartTooltip } from '../components/ChartTooltip'
import {
  dashboardStats,
  mockScanPoints,
  monthlySpreadTrend,
} from '../data/mockScans'
import {
  mockSpecies,
  speciesById,
  speciesSelectOptions,
  topInvasiveSpecies,
} from '../data/mockSpecies'

const topSpeciesData = topInvasiveSpecies.map((species) => {
  const record = speciesById[species.speciesId]
  return {
    ...species,
    status: record?.status || 'Invasive',
    fill: record?.status === 'Native' ? '#6b6b6b' : '#23855a',
  }
})

export function Dashboard() {
  const [region, setRegion] = useState('region-1')
  const [speciesFilter, setSpeciesFilter] = useState('all')

  const filteredPoints = useMemo(() => {
    if (speciesFilter === 'all') return mockScanPoints
    return mockScanPoints.filter((point) => point.speciesId === speciesFilter)
  }, [speciesFilter])


  return (
    <div className="mx-auto w-full max-w-content p-4 sm:p-6">
      <PageHeader
        title="Dashboard"
        description="AI-assisted detection overview for Invasive Alien Plant Species across the Ilocos Region. Mock field data, refreshed Nov 21, 2026."
      >
        <Link to="/scanner" className="btn btn-primary">
          <ScanLine size={14} />
          New field scan
        </Link>
      </PageHeader>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Regional summary">
        <StatCard
          label="Total Scans"
          value={dashboardStats.totalScans.toLocaleString('en-US')}
          helper="+112 scans this month"
          progress={78}
          icon={ScanLine}
        />
        <StatCard
          label="Invasive Detections"
          value={dashboardStats.invasiveDetections.toLocaleString('en-US')}
          helper="48% of all field scans"
          progress={48}
          icon={AlertTriangle}
          tone="danger"
        />
        <StatCard
          label="Active Hotspots"
          value={dashboardStats.activeHotspots}
          helper="5 high-severity zones"
          progress={72}
          icon={MapPin}
          tone="warning"
        />
        <StatCard
          label="Cleared Areas"
          value={`${dashboardStats.clearedHectares} ha`}
          helper="+12.4 ha this quarter"
          progress={64}
          icon={Sprout}
          tone="success"
        />
      </section>

      <section className="panel mt-4 overflow-hidden">
        <div className="card-header flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded border border-border bg-app text-muted">
              <MapPin size={14} />
            </div>
            <div>
              <h2 className="card-title">Ilocos Region detection map</h2>
              <p className="card-description">
                Field observations, severity circles, and weighted invasion heat surface.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:ml-auto sm:flex-row">
            <div className="flex items-center gap-2">
              <label htmlFor="dashboard-region" className="sr-only">
                Region
              </label>
              <select
                id="dashboard-region"
                className="select h-8 w-full text-[10.5px] sm:w-[200px]"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
              >
                <option value="region-1">Region 1 - Ilocos Region</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="dashboard-species" className="sr-only">
                Species
              </label>
              <select
                id="dashboard-species"
                className="select h-8 w-full text-[10.5px] sm:w-[186px]"
                value={speciesFilter}
                onChange={(event) => setSpeciesFilter(event.target.value)}
              >
                {speciesSelectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-app px-4 py-2">
          <Filter size={11} className="text-subtle" />
          <span className="text-[9.5px] text-subtle">
            Filtered observations:
            <span className="mono ml-1 text-muted">{filteredPoints.length}</span>
          </span>
          <span className="hidden h-3 w-px bg-border sm:block" />
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[9.5px] text-subtle">WGS 84 · Interactive map</span>
          </div>
          <span className="mono ml-auto rounded border border-border bg-app px-1.5 py-0.5 text-[8.5px] text-subtle">
            LIVE MOCK
          </span>
        </div>

        <div className="relative h-[380px] w-full sm:h-[460px]">
          <MapView points={filteredPoints} showHeatmap showDetections showProvinces />
          <Legend className="absolute bottom-3 left-3 z-[500] w-[190px]" />
          <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded-md border border-border bg-panel/95 px-2.5 py-1.5">
            <p className="mono text-[8.5px] text-subtle">
              <span className="text-brand">{mockSpecies.filter((item) => item.status === 'Invasive').length}</span>{' '}
              invasive species tracked
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="panel min-w-0">
          <div className="card-header">
            <div>
              <h2 className="card-title">Top Invasive Species</h2>
              <p className="card-description">Confirmed detections by priority species.</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-sm bg-brand" />
                Invasive
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-sm bg-[#a3a39b]" />
                Native
              </span>
            </div>
          </div>
          <div className="px-2 pb-3 pt-4">
            <div className="h-[244px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topSpeciesData}
                  layout="vertical"
                  margin={{ top: 0, right: 32, left: 4, bottom: 0 }}
                  barCategoryGap={13}
                >
                  <CartesianGrid stroke="#2e2e2e" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={74}
                    tick={{ fill: '#a1a1a1', fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.025)' }}
                    content={<ChartTooltip />}
                  />
                  <Bar dataKey="value" name="Detections" radius={[0, 4, 4, 0]} barSize={13}>
                    {topSpeciesData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="value"
                      position="right"
                      style={{
                        fill: '#a1a1a1',
                        fontSize: 9,
                        fontFamily: 'JetBrains Mono',
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <span className="mono text-[9px] text-subtle">DATASET · IAPS-REG1-v3</span>
            <span className="text-[9.5px] text-subtle">
              <span className="mono text-muted">777</span> classified detections
            </span>
          </div>
        </div>

        <div className="panel min-w-0">
          <div className="card-header">
            <div>
              <h2 className="card-title">Monthly Spread Trend</h2>
              <p className="card-description">Detections and active hotspots, Jan–Dec 2026.</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-2.5 rounded-sm bg-brand" />
                Detections
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-2.5 rounded-full bg-inv-mod" />
                Hotspots
              </span>
            </div>
          </div>
          <div className="px-2 pb-3 pt-4">
            <div className="h-[244px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlySpreadTrend}
                  margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                >
                  <CartesianGrid stroke="#2e2e2e" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 9 }}
                    dy={5}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    domain={[0, 24]}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
                  <Bar
                    yAxisId="left"
                    dataKey="detections"
                    name="Detections"
                    fill="#23855a"
                    radius={[3, 3, 0, 0]}
                    barSize={10}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="hotspots"
                    name="Hotspots"
                    stroke="#b85c08"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: '#b85c08', stroke: '#232323', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <span className="text-[9.5px] text-subtle">
              Peak spread in <span className="text-muted">November</span>
            </span>
            <span className="mono flex items-center gap-1 text-[9px] text-inv-mod">
              <Trees size={10} /> 18 active zones
            </span>
          </div>
        </div>
      </section>

      <p className="mt-4 text-center text-[9px] text-subtle">
        Prototype decision support only · Detection values are simulated for demonstration.
      </p>
    </div>
  )
}
