import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  LayoutGrid,
  List,
  MapPin,
  Search,
  Tags,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/Badge'
import { SpeciesThumb } from '../components/SpeciesThumb'
import {
  dataSources,
  preprocessingSteps,
  mockSpecies,
} from '../data/mockSpecies'
import { sampleOccurrenceDataset } from '../data/mockScans'

const sourceIcons = {
  image: ImageIcon,
  camera: Camera,
  pin: MapPin,
  database: Database,
  tags: Tags,
}

export function SpeciesDatabase() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [view, setView] = useState('table')

  const setQuery = (value) => {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  const filteredSpecies = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return mockSpecies
    return mockSpecies.filter((species) =>
      `${species.commonName} ${species.scientificName} ${species.status} ${species.family}`
        .toLowerCase()
        .includes(q),
    )
  }, [query])

  const invasiveCount = mockSpecies.filter((species) => species.status === 'Invasive').length

  return (
    <div className="mx-auto w-full max-w-content p-4 sm:p-6">
      <PageHeader
        title="Species Database"
        description="Target IAPS classes, occurrence records, and the field image data pipeline used for model training."
      >
        <Badge variant="brand" dot>
          {mockSpecies.length} classes
        </Badge>
        <Badge variant="neutral" className="mono">
          {invasiveCount} invasive
        </Badge>
      </PageHeader>

      <section className="panel overflow-hidden">
        <div className="card-header flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
          <div>
            <h2 className="card-title">Target species</h2>
            <p className="card-description">Curated Region 1 classification classes.</p>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="relative min-w-0 flex-1 sm:w-[220px]">
              <Search
                size={13}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search species…"
                className="input h-8 pl-8 pr-7 text-[11px]"
                aria-label="Search species database"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-subtle hover:bg-hover hover:text-ink"
                  aria-label="Clear search"
                >
                  <X size={11} />
                </button>
              )}
            </div>
            <div className="flex h-8 shrink-0 items-center rounded-md border border-border bg-app p-0.5">
              <button
                type="button"
                onClick={() => setView('table')}
                aria-pressed={view === 'table'}
                className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-150 ${
                  view === 'table'
                    ? 'bg-brand/10 text-brand'
                    : 'text-subtle hover:text-ink'
                }`}
                title="Table view"
              >
                <List size={13} />
              </button>
              <button
                type="button"
                onClick={() => setView('cards')}
                aria-pressed={view === 'cards'}
                className={`flex h-7 w-7 items-center justify-center rounded transition-colors duration-150 ${
                  view === 'cards'
                    ? 'bg-brand/10 text-brand'
                    : 'text-subtle hover:text-ink'
                }`}
                title="Card view"
              >
                <LayoutGrid size={13} />
              </button>
            </div>
          </div>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[760px]">
              <thead>
                <tr>
                  <th className="w-[58px]">Image</th>
                  <th>Common name</th>
                  <th>Scientific name</th>
                  <th>Status</th>
                  <th className="text-right">Detections</th>
                  <th>Provinces affected</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpecies.map((species) => (
                  <tr key={species.id}>
                    <td>
                      <SpeciesThumb species={species} size="sm" />
                    </td>
                    <td>
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        {species.commonName}
                        {species.alias && (
                          <span className="text-[10px] font-normal text-subtle">
                            / {species.alias}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[9.5px] text-subtle">
                        {species.family}
                      </span>
                    </td>
                    <td className="mono text-[10.5px] italic text-muted">
                      {species.scientificName}
                    </td>
                    <td>
                      <Badge status={species.status}>{species.status}</Badge>
                    </td>
                    <td className="mono text-right text-[11px] text-ink">
                      {species.detections}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {species.provinces.map((province) => (
                          <span
                            key={province}
                            className="rounded border border-border bg-app px-1.5 py-0.5 text-[9px] text-muted"
                          >
                            {province}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSpecies.map((species) => (
              <article
                key={species.id}
                className="overflow-hidden rounded-lg border border-border bg-app transition-colors duration-150 hover:border-[#c9c9c1]"
              >
                <SpeciesThumb species={species} size="xl" />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[13px] font-medium text-ink">
                        {species.commonName}
                        {species.alias && (
                          <span className="ml-1.5 text-[10px] font-normal text-subtle">
                            / {species.alias}
                          </span>
                        )}
                      </h3>
                      <p className="mono mt-0.5 text-[9.5px] italic text-muted">
                        {species.scientificName}
                      </p>
                    </div>
                    <Badge status={species.status}>{species.status}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-subtle">
                    {species.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                    <div>
                      <p className="mono text-[13px] font-medium text-ink">{species.detections}</p>
                      <p className="text-[8.5px] text-subtle">detections</p>
                    </div>
                    <div className="text-right">
                      <p className="mono text-[10px] text-muted">
                        {species.provinces.length} provinces
                      </p>
                      <p className="mt-0.5 text-[8.5px] text-subtle">{species.family}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredSpecies.length === 0 && (
          <div className="px-4 py-10 text-center">
            <p className="text-[11.5px] font-medium text-ink">No species match “{query}”</p>
            <p className="mt-1 text-[10px] text-subtle">
              Try Hagonoy, Lantana, Leucaena, Narra, or Gumamela.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-app px-3 py-2">
          <span className="text-[9px] text-subtle">
            Showing <span className="mono text-muted">{filteredSpecies.length}</span> of{' '}
            <span className="mono text-muted">{mockSpecies.length}</span> target classes
          </span>
          <span className="mono text-[8.5px] text-subtle">LABELS · INVASIVE / NATIVE</span>
        </div>
      </section>

      <section className="mt-4">
        <div className="mb-2.5 flex items-end justify-between">
          <div>
            <h2 className="text-[12px] font-medium text-ink">Data sources</h2>
            <p className="text-[10px] text-subtle">Field capture and reference image inputs.</p>
          </div>
          <span className="mono text-[8.5px] text-subtle">IAPS-REG1-v3</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {dataSources.map((source) => {
            const Icon = sourceIcons[source.icon] || Database
            return (
              <article
                key={source.title}
                className="panel p-3 transition-colors duration-150 hover:border-[#c9c9c1]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded border border-border bg-app text-brand">
                  <Icon size={13} />
                </div>
                <h3 className="mt-2.5 text-[11px] font-medium text-ink">{source.title}</h3>
                <p className="mono mt-0.5 text-[8.5px] text-brand">{source.detail}</p>
                <p className="mt-1.5 text-[9.5px] leading-4 text-subtle">{source.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <section className="panel min-w-0 overflow-hidden">
          <div className="card-header">
            <div>
              <h2 className="card-title">Sample Occurrence &amp; Scan Dataset</h2>
              <p className="card-description">Reference records used to validate geotag and class labels.</p>
            </div>
            <Badge variant="neutral" className="mono">
              CSV · 5 rows
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table min-w-[440px]">
              <thead>
                <tr>
                  <th className="w-[64px]">ID</th>
                  <th>Coordinates</th>
                  <th>Species</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleOccurrenceDataset.map((record) => (
                  <tr key={record.id}>
                    <td className="mono text-[10.5px] text-subtle">{record.id}</td>
                    <td className="mono text-[10.5px] text-muted">{record.coordinates}</td>
                    <td className="font-medium text-ink">{record.species}</td>
                    <td className="text-right">
                      <Badge status={record.status}>{record.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-app px-3 py-2">
            <p className="mono text-[8.5px] text-subtle">
              SOURCE · FIELD SCANS + GBIF OCCURRENCE EXPORT · REGION 1
            </p>
          </div>
        </section>

        <section className="panel min-w-0 overflow-hidden">
          <div className="card-header">
            <div>
              <h2 className="card-title">Image preprocessing</h2>
              <p className="card-description">Pipeline applied before model training.</p>
            </div>
            <span className="flex items-center gap-1 text-[9px] text-brand">
              <CheckCircle2 size={11} />
              4/4
            </span>
          </div>
          <div className="p-3.5">
            <div className="space-y-2">
              {preprocessingSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2.5 rounded-md border border-border bg-app px-2.5 py-2.5"
                >
                  <CheckCircle2 size={14} className="shrink-0 text-brand" />
                  <span className="flex-1 text-[10.5px] text-muted">{step}</span>
                  <span className="mono text-[8.5px] text-subtle">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-md border border-border bg-app p-3">
              <div className="flex items-center justify-between">
                <span className="mono text-[8.5px] text-subtle">PIPELINE STATUS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[9px] text-subtle">Input size</p>
                  <p className="mono mt-0.5 text-[10px] text-ink">224 × 224 px</p>
                </div>
                <div>
                  <p className="text-[9px] text-subtle">Split</p>
                  <p className="mono mt-0.5 text-[10px] text-ink">80 / 20</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
