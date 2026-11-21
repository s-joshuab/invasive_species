import { useMemo, useState } from 'react'
import {
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Columns3,
  List,
  MapPin,
  Plus,
  Ruler,
  RotateCcw,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/Badge'
import { Drawer } from '../components/Drawer'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'
import {
  eradicationAgencies,
  eradicationStatuses,
  eradicationStatusStyles,
  mockEradicationLogs,
} from '../data/mockEradication'

const provinces = ['Ilocos Norte', 'Ilocos Sur', 'La Union', 'Pangasinan']
const speciesOptions = ['Hagonoy', 'Lantana', 'Ipil-ipil', 'Narra']

const provinceCoordinates = {
  'Ilocos Norte': { lat: 18.1978, lng: 120.5936 },
  'Ilocos Sur': { lat: 17.575, lng: 120.387 },
  'La Union': { lat: 16.6159, lng: 120.3209 },
  Pangasinan: { lat: 16.0433, lng: 120.3333 },
}

const statusDotColors = {
  Reported: '#a1a1a1',
  Scheduled: '#1d4ed8',
  'In Progress': '#b85c08',
  Cleared: '#23855a',
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function createEmptyForm() {
  return {
    location: '',
    municipality: '',
    province: 'Ilocos Norte',
    species: 'Hagonoy',
    area: '',
    agency: 'DENR CENRO Laoag',
    status: 'Reported',
    date: todayISO(),
    remarks: '',
  }
}

export function EradicationLogs() {
  const { showToast } = useToast()
  const [logs, setLogs] = useState(mockEradicationLogs)
  const [view, setView] = useState('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [provinceFilter, setProvinceFilter] = useState('all')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [selectedLogId, setSelectedLogId] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState(createEmptyForm)

  const selectedLog = logs.find((log) => log.id === selectedLogId) || null

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        if (statusFilter !== 'all' && log.status !== statusFilter) return false
        if (provinceFilter !== 'all' && log.province !== provinceFilter) return false
        if (speciesFilter !== 'all' && log.species !== speciesFilter) return false
        return true
      }),
    [logs, statusFilter, provinceFilter, speciesFilter],
  )

  const hasActiveFilters =
    statusFilter !== 'all' || provinceFilter !== 'all' || speciesFilter !== 'all'

  const resetFilters = () => {
    setStatusFilter('all')
    setProvinceFilter('all')
    setSpeciesFilter('all')
  }

  const updateStatus = (logId, nextStatus) => {
    setLogs((current) =>
      current.map((log) => (log.id === logId ? { ...log, status: nextStatus } : log)),
    )
    showToast({
      type: nextStatus === 'Cleared' ? 'success' : 'info',
      title: `Status updated to ${nextStatus}`,
      description: 'The eradication tracker was updated locally (mock action).',
    })
  }

  const updateFormField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const openCreateModal = () => {
    setForm(createEmptyForm())
    setIsCreateOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateOpen(false)
  }

  const handleCreateLog = (event) => {
    event.preventDefault()

    if (!form.location.trim() || !form.municipality.trim() || Number(form.area) <= 0) {
      showToast({
        type: 'warning',
        title: 'Complete the required fields',
        description: 'Location, municipality, and an area greater than zero are required.',
      })
      return
    }

    const nextIdNumber =
      Math.max(...logs.map((log) => Number(log.id.replace('ERD-', '')) || 0)) + 1
    const coordinates = provinceCoordinates[form.province] || {
      lat: 16.85,
      lng: 120.55,
    }

    const newLog = {
      id: `ERD-${String(nextIdNumber).padStart(3, '0')}`,
      location: form.location.trim(),
      municipality: form.municipality.trim(),
      province: form.province,
      species: form.species,
      lat: coordinates.lat,
      lng: coordinates.lng,
      area: Number(form.area),
      agency: form.agency,
      status: form.status,
      date: form.date,
      remarks: form.remarks.trim() || 'Newly logged eradication action.',
    }

    setLogs((current) => [newLog, ...current])
    setIsCreateOpen(false)
    showToast({
      type: 'success',
      title: `Eradication log ${newLog.id} created`,
      description: `${newLog.location} · ${newLog.area} ha · ${newLog.status}`,
    })
  }

  return (
    <div className="mx-auto w-full max-w-content p-4 sm:p-6">
      <PageHeader
        title="Eradication Logs"
        description="Action tracker for DENR and LGU field operations across the Ilocos Region."
      >
        <button type="button" onClick={openCreateModal} className="btn btn-primary">
          <Plus size={14} />
          Log new eradication
        </button>
      </PageHeader>

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-2.5 border-b border-border px-3 pt-2.5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4" role="tablist" aria-label="Log view">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'table'}
              onClick={() => setView('table')}
              className={`relative flex h-9 items-center gap-1.5 border-b-2 px-1 text-[11.5px] font-medium transition-colors duration-150 ${
                view === 'table'
                  ? 'border-brand text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <List size={13} />
              Table
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'kanban'}
              onClick={() => setView('kanban')}
              className={`relative flex h-9 items-center gap-1.5 border-b-2 px-1 text-[11.5px] font-medium transition-colors duration-150 ${
                view === 'kanban'
                  ? 'border-brand text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              <Columns3 size={13} />
              Kanban
            </button>
          </div>
          <div className="flex items-center gap-2 pb-2 sm:pb-2.5">
            <span className="mono text-[9px] text-subtle">
              {filteredLogs.length} / {logs.length} records
            </span>
            <Badge variant="neutral" className="mono">
              FY 2026
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2 border-b border-border bg-app px-3 py-2.5">
          <div className="w-full sm:w-auto">
            <label htmlFor="filter-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="filter-status"
              className="select h-8 w-full text-[10.5px] sm:w-[150px]"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {eradicationStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[calc(50%-4px)] sm:w-auto">
            <label htmlFor="filter-province" className="sr-only">
              Filter by province
            </label>
            <select
              id="filter-province"
              className="select h-8 w-full text-[10.5px] sm:w-[152px]"
              value={provinceFilter}
              onChange={(event) => setProvinceFilter(event.target.value)}
            >
              <option value="all">All provinces</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className="w-[calc(50%-4px)] sm:w-auto">
            <label htmlFor="filter-species" className="sr-only">
              Filter by species
            </label>
            <select
              id="filter-species"
              className="select h-8 w-full text-[10.5px] sm:w-[140px]"
              value={speciesFilter}
              onChange={(event) => setSpeciesFilter(event.target.value)}
            >
              <option value="all">All species</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-ghost btn-sm -ml-0.5"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )}
          <div className="ml-auto hidden items-center gap-1.5 pb-1 text-[9px] text-subtle sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Click a row to view details
          </div>
        </div>

        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="data-table min-w-[1040px]">
              <thead>
                <tr>
                  <th className="w-[92px]">ID</th>
                  <th>Location</th>
                  <th>Species</th>
                  <th className="text-right">Area (ha)</th>
                  <th>Assigned agency</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Remarks</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setSelectedLogId(log.id)
                      }
                    }}
                    tabIndex={0}
                    className="cursor-pointer focus-visible:bg-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand/40"
                    aria-label={`Open ${log.id}, ${log.location}`}
                  >
                    <td className="mono text-[10px] text-subtle">{log.id}</td>
                    <td>
                      <span className="font-medium text-ink">{log.location}</span>
                      <span className="mt-0.5 block text-[9.5px] text-subtle">
                        {log.municipality}, {log.province}
                      </span>
                    </td>
                    <td className="text-muted">{log.species}</td>
                    <td className="mono text-right text-[11px] text-ink">{log.area}</td>
                    <td className="text-[10.5px] text-muted">{log.agency}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          eradicationStatusStyles[log.status]
                        }`}
                      >
                        <span
                          className="h-1 w-1 rounded-full bg-current"
                          aria-hidden="true"
                        />
                        {log.status}
                      </span>
                    </td>
                    <td className="mono text-[10px] text-muted">{log.date}</td>
                    <td>
                      <span
                        className="block max-w-[190px] truncate text-[10px] text-subtle"
                        title={log.remarks}
                      >
                        {log.remarks}
                      </span>
                    </td>
                    <td>
                      <ChevronRight size={13} className="text-subtle" />
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="9">
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <ClipboardList size={20} className="text-subtle" />
                        <p className="mt-2 text-[11.5px] font-medium text-ink">
                          No eradication records match the filters
                        </p>
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-2 text-[10px] text-brand hover:text-brand-hover"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto p-3">
            <div className="flex min-w-[980px] gap-3">
              {eradicationStatuses.map((status) => {
                const records = filteredLogs.filter((log) => log.status === status)
                return (
                  <div
                    key={status}
                    className="min-w-0 flex-1 rounded-md border border-border bg-app"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: statusDotColors[status] }}
                        />
                        <h3 className="text-[10.5px] font-medium text-ink">{status}</h3>
                      </div>
                      <span className="mono rounded border border-border bg-app px-1.5 py-0.5 text-[8.5px] text-subtle">
                        {records.length}
                      </span>
                    </div>
                    <div className="min-h-[160px] space-y-2 p-2">
                      {records.map((log) => (
                        <button
                          key={log.id}
                          type="button"
                          onClick={() => setSelectedLogId(log.id)}
                          className="w-full rounded-md border border-border bg-panel p-2.5 text-left transition-colors duration-150 hover:border-[#c9c9c1] hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="mono text-[8.5px] text-subtle">{log.id}</span>
                            <span className="mono text-[9px] text-inv-mod">{log.area} ha</span>
                          </div>
                          <p className="mt-1.5 text-[11px] font-medium leading-4 text-ink">
                            {log.location}
                          </p>
                          <p className="mt-0.5 text-[9px] text-subtle">
                            {log.municipality}, {log.province}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-1.5">
                            <span className="truncate text-[9px] text-muted">{log.species}</span>
                            <span className="mono text-[8px] text-subtle">{log.date}</span>
                          </div>
                        </button>
                      ))}
                      {records.length === 0 && (
                        <p className="px-1 py-6 text-center text-[9px] text-subtle">
                          No records
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-app px-3 py-2">
          <span className="text-[9px] text-subtle">
            Mock DENR / LGU action tracker · table and board share the same filters
          </span>
          <span className="mono text-[8.5px] text-subtle">
            {filteredLogs.reduce((sum, log) => sum + log.area, 0).toFixed(1)} HA IN VIEW
          </span>
        </div>
      </section>

      <Drawer
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLogId(null)}
        eyebrow="Eradication action"
        title={selectedLog ? `${selectedLog.id} · ${selectedLog.location}` : ''}
        description={
          selectedLog
            ? `${selectedLog.municipality}, ${selectedLog.province} · logged ${selectedLog.date}`
            : ''
        }
        footer={
          <button
            type="button"
            onClick={() => setSelectedLogId(null)}
            className="btn btn-secondary"
          >
            Close
          </button>
        }
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Badge status={selectedLog.status} dot>
                {selectedLog.status}
              </Badge>
              <span className="mono text-[9px] text-subtle">RECORD {selectedLog.id}</span>
            </div>

            <div className="rounded-md border border-border bg-app p-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <DetailItem
                  icon={MapPin}
                  label="Location"
                  value={`${selectedLog.municipality}, ${selectedLog.province}`}
                />
                <DetailItem icon={Ruler} label="Area" value={`${selectedLog.area} ha`} mono />
                <DetailItem icon={Building2} label="Agency" value={selectedLog.agency} />
                <DetailItem
                  icon={CalendarDays}
                  label="Logged"
                  value={selectedLog.date}
                  mono
                />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
                <span className="text-[9px] text-subtle">Target species</span>
                <Badge variant="moderate">{selectedLog.species}</Badge>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] text-subtle">Coordinates</span>
                <span className="mono text-[9.5px] text-muted">
                  {selectedLog.lat.toFixed(4)}, {selectedLog.lng.toFixed(4)}
                </span>
              </div>
            </div>

            <div>
              <p className="eyebrow">Field remarks</p>
              <p className="mt-1.5 rounded-md border border-border bg-app p-3 text-[11px] leading-5 text-muted">
                {selectedLog.remarks}
              </p>
            </div>

            <div>
              <p className="eyebrow mb-2.5">Progress</p>
              <div className="flex items-start">
                {eradicationStatuses.map((status, index) => {
                  const currentIndex = eradicationStatuses.indexOf(selectedLog.status)
                  const complete = index <= currentIndex
                  return (
                    <div key={status} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex w-full items-center">
                        <span
                          className={`mx-auto h-2 w-2 rounded-full border ${
                            complete
                              ? 'border-brand bg-brand'
                              : 'border-brand bg-brand/5'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-center text-[8.5px] ${
                          complete ? 'text-muted' : 'text-subtle'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-md border border-border bg-app p-3">
              <label htmlFor="update-status" className="label">
                Update status
              </label>
              <select
                id="update-status"
                className="select h-8"
                value={selectedLog.status}
                onChange={(event) => updateStatus(selectedLog.id, event.target.value)}
              >
                {eradicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[9px] leading-4 text-subtle">
                Demo status changes update this session only and are not persisted to a backend.
              </p>
            </div>
          </div>
        )}
      </Drawer>

      <Modal
        open={isCreateOpen}
        onClose={closeCreateModal}
        title="Log new eradication"
        description="Create a mock field action record. No backend request is sent."
        size="lg"
        footer={
          <>
            <button type="button" onClick={closeCreateModal} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" form="new-eradication-form" className="btn btn-primary">
              <Plus size={13} />
              Create log
            </button>
          </>
        }
      >
        <form id="new-eradication-form" onSubmit={handleCreateLog} className="space-y-3.5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="new-location" className="label">
                Site / location name
              </label>
              <input
                id="new-location"
                className="input"
                value={form.location}
                onChange={(event) => updateFormField('location', event.target.value)}
                placeholder="e.g. Paoay Grassland"
                required
              />
            </div>
            <div>
              <label htmlFor="new-municipality" className="label">
                Municipality / city
              </label>
              <input
                id="new-municipality"
                className="input"
                value={form.municipality}
                onChange={(event) => updateFormField('municipality', event.target.value)}
                placeholder="e.g. Paoay"
                required
              />
            </div>
            <div>
              <label htmlFor="new-province" className="label">
                Province
              </label>
              <select
                id="new-province"
                className="select"
                value={form.province}
                onChange={(event) => updateFormField('province', event.target.value)}
              >
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-species" className="label">
                Target species
              </label>
              <select
                id="new-species"
                className="select"
                value={form.species}
                onChange={(event) => updateFormField('species', event.target.value)}
              >
                {speciesOptions.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-area" className="label">
                Area (hectares)
              </label>
              <input
                id="new-area"
                type="number"
                min="0.1"
                step="0.1"
                className="input mono"
                value={form.area}
                onChange={(event) => updateFormField('area', event.target.value)}
                placeholder="0.0"
                required
              />
            </div>
            <div>
              <label htmlFor="new-date" className="label">
                Action date
              </label>
              <input
                id="new-date"
                type="date"
                className="input mono"
                value={form.date}
                onChange={(event) => updateFormField('date', event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="new-agency" className="label">
                Assigned agency
              </label>
              <select
                id="new-agency"
                className="select"
                value={form.agency}
                onChange={(event) => updateFormField('agency', event.target.value)}
              >
                {eradicationAgencies.map((agency) => (
                  <option key={agency} value={agency}>
                    {agency}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-status" className="label">
                Initial status
              </label>
              <select
                id="new-status"
                className="select"
                value={form.status}
                onChange={(event) => updateFormField('status', event.target.value)}
              >
                {eradicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="new-remarks" className="label">
              Remarks <span className="font-normal text-subtle">(optional)</span>
            </label>
            <textarea
              id="new-remarks"
              className="input min-h-[78px] resize-y py-2"
              value={form.remarks}
              onChange={(event) => updateFormField('remarks', event.target.value)}
              placeholder="Access notes, treatments planned, or field observations…"
            />
          </div>
          <div className="flex items-start gap-2 rounded-md border border-border bg-app px-3 py-2">
            <X size={12} className="mt-0.5 shrink-0 text-subtle" />
            <p className="text-[9px] leading-4 text-subtle">
              This creates a local demo record only. The mock backend is intentionally omitted
              from this prototype.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value, mono = false }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[9px] text-subtle">
        <Icon size={10} />
        {label}
      </div>
      <p className={`mt-1 text-[10.5px] leading-4 text-muted ${mono ? 'mono' : ''}`}>{value}</p>
    </div>
  )
}
