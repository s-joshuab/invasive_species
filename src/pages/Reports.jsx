import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BrainCircuit, Download, ScanSearch, Sparkles, Trophy } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/Badge'
import { ChartTooltip } from '../components/ChartTooltip'
import { useToast } from '../components/Toast'
import {
  confusionByClass,
  evaluationSummary,
  modelComparison,
  modelDescriptions,
  modelMetricData,
} from '../data/mockMetrics'

export function Reports() {
  const { showToast } = useToast()
  const bestModel = modelComparison.find(
    (model) => model.model === evaluationSummary.bestModel,
  )

  const handleExport = () => {
    showToast({
      type: 'success',
      title: 'Export prepared',
      description: 'Model evaluation report (PDF) would be downloaded in the production system.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-content p-4 sm:p-6">
      <PageHeader
        title="Reports"
        description="Model evaluation, classification performance, and exportable decision-support summaries."
      >
        <button type="button" onClick={handleExport} className="btn btn-primary">
          <Download size={14} />
          Export Report
        </button>
      </PageHeader>

      <section className="panel flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="eyebrow">Evaluation</span>
          <Badge variant="brand" dot>
            Complete
          </Badge>
        </div>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <MetaItem label="Dataset" value={evaluationSummary.dataset} />
          <MetaItem label="Images" value={evaluationSummary.images.toLocaleString('en-US')} />
          <MetaItem label="Classes" value={evaluationSummary.classes} />
          <MetaItem label="Split" value={evaluationSummary.split} />
          <MetaItem label="Last evaluated" value={evaluationSummary.lastEvaluated} />
        </div>
        <span className="mono ml-auto hidden rounded border border-border bg-app px-2 py-1 text-[8.5px] text-subtle lg:block">
          MOCK EVALUATION · NO LIVE MODEL
        </span>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="panel overflow-hidden">
          <div className="card-header">
            <div>
              <h2 className="card-title">Model comparison</h2>
              <p className="card-description">Held-out test set metrics across both architectures.</p>
            </div>
            <Trophy size={14} className="text-inv-mod" />
          </div>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[620px]">
              <thead>
                <tr>
                  <th>Model</th>
                  <th className="text-right">Accuracy</th>
                  <th className="text-right">Precision</th>
                  <th className="text-right">Recall</th>
                  <th className="text-right">F1</th>
                  <th className="text-right">Size</th>
                  <th className="text-right">Latency</th>
                </tr>
              </thead>
              <tbody>
                {modelComparison.map((model) => {
                  const isBest = model.model === evaluationSummary.bestModel
                  return (
                    <tr key={model.model} className={isBest ? 'bg-brand/[0.025]' : undefined}>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: model.color }}
                          />
                          <span className="font-medium text-ink">{model.model}</span>
                          {isBest && (
                            <Badge variant="brand" className="ml-0.5">
                              best
                            </Badge>
                          )}
                        </div>
                        <p className="mono mt-0.5 text-[9px] text-subtle">{model.task}</p>
                      </td>
                      <td className="mono text-right text-[11px] text-ink">
                        {model.accuracy.toFixed(2)}
                      </td>
                      <td className="mono text-right text-[11px] text-muted">
                        {model.precision.toFixed(2)}
                      </td>
                      <td className="mono text-right text-[11px] text-muted">
                        {model.recall.toFixed(2)}
                      </td>
                      <td
                        className={`mono text-right text-[11px] ${
                          isBest ? 'font-medium text-brand' : 'text-ink'
                        }`}
                      >
                        {model.f1.toFixed(2)}
                      </td>
                      <td className="mono text-right text-[10px] text-subtle">{model.size}</td>
                      <td className="mono text-right text-[10px] text-subtle">
                        {model.inference}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-app px-3 py-2.5">
            <span className="text-[9px] text-subtle">
              Higher is better · normalized to 2 decimal places
            </span>
            <span className="mono flex items-center gap-1 text-[9px] text-brand">
              <Sparkles size={10} />
              {evaluationSummary.bestModel} · F1 {evaluationSummary.bestF1.toFixed(2)}
            </span>
          </div>
        </section>

        <section className="panel min-w-0 overflow-hidden">
          <div className="card-header">
            <div>
              <h2 className="card-title">Metric comparison</h2>
              <p className="card-description">Accuracy, precision, recall, and F1 by model.</p>
            </div>
            <div className="flex items-center gap-3 text-[8.5px] text-subtle">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-[#8b8b8b]" />
                MobileNetV2
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-sm bg-brand" />
                YOLOv8
              </span>
            </div>
          </div>
          <div className="px-2 pb-3 pt-4">
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={modelMetricData}
                  margin={{ top: 4, right: 8, left: -22, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid stroke="#2e2e2e" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="metric"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1a1', fontSize: 9 }}
                    dy={5}
                  />
                  <YAxis
                    domain={[80, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    content={<ChartTooltip valueSuffix="%" />}
                    cursor={{ fill: 'rgba(255,255,255,0.025)' }}
                  />
                  <Bar
                    dataKey="MobileNetV2"
                    name="MobileNetV2"
                    fill="#8b8b8b"
                    radius={[3, 3, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="YOLOv8-Cls"
                    name="YOLOv8-Cls"
                    fill="#23855a"
                    radius={[3, 3, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px border-t border-border bg-border text-center">
            <div className="bg-panel px-2 py-2.5">
              <p className="text-[8.5px] text-subtle">Best accuracy</p>
              <p className="mono mt-0.5 text-[15px] text-brand">
                {bestModel ? (bestModel.accuracy * 100).toFixed(0) : '—'}%
              </p>
            </div>
            <div className="bg-panel px-2 py-2.5">
              <p className="text-[8.5px] text-subtle">Inference delta</p>
              <p className="mono mt-0.5 text-[15px] text-ink">+25 ms</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {modelDescriptions.map((model, index) => {
          const Icon = index === 0 ? BrainCircuit : ScanSearch
          return (
            <article key={model.name} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border"
                    style={{
                      color: model.accent,
                      borderColor: `${model.accent}33`,
                      backgroundColor: `${model.accent}12`,
                    }}
                  >
                    <Icon size={17} />
                  </span>
                  <div>
                    <h2 className="text-[13px] font-medium text-ink">{model.name}</h2>
                    <p className="mt-0.5 text-[10px] text-subtle">{model.role}</p>
                  </div>
                </div>
                <span className="mono rounded border border-border bg-app px-1.5 py-0.5 text-[8px] text-subtle">
                  {index === 0 ? 'CNN' : 'DETECT + CLS'}
                </span>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-muted">{model.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                {model.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded border border-border bg-app px-2 py-1 text-[9px] text-subtle"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <section className="panel mt-4 overflow-hidden">
        <div className="card-header">
          <div>
            <h2 className="card-title">Per-class validation · YOLOv8-Cls</h2>
            <p className="card-description">Precision and recall across the five target classes.</p>
          </div>
          <Badge variant="neutral" className="mono">
            n = 882
          </Badge>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          {confusionByClass.map((item) => (
            <div key={item.class} className="rounded-md border border-border bg-app p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10.5px] font-medium text-ink">{item.class}</p>
                <span className="mono text-[8.5px] text-subtle">{item.support}</span>
              </div>
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[8.5px] text-subtle">
                  <span>Precision</span>
                  <span className="mono text-muted">{item.precision.toFixed(2)}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-app">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${item.precision * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[8.5px] text-subtle">
                  <span>Recall</span>
                  <span className="mono text-muted">{item.recall.toFixed(2)}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-app">
                  <div
                    className="h-full rounded-full bg-[#8b8b8b]"
                    style={{ width: `${item.recall * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-4 text-center text-[9px] text-subtle">
        Evaluation figures are simulated for this front-end prototype. No image or model data was
        sent to a server.
      </p>
    </div>
  )
}

function MetaItem({ label, value }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] text-subtle">{label}</span>
      <span className="mono text-[10px] text-muted">{value}</span>
    </div>
  )
}
