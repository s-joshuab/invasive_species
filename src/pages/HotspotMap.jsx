import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  Circle,
  CircleMarker,
  GeoJSON,
  Polyline,
  Popup,
  ScaleControl,
  Tooltip,
  useMap,
} from 'react-leaflet'
import { MapView } from '../components/MapView'
import { LayerPanel } from '../components/LayerPanel'
import { Legend } from '../components/Legend'
import { PageHeader } from '../components/PageHeader'
import { Badge } from '../components/Badge'
import { threatLevels } from '../data/mockScans'
import { mockHotspots } from '../data/mockHotspots'
import {
  elevationZones,
  lguBoundaries,
  protectedAreasGeoJSON,
  transportCorridors,
} from '../data/mockGeoJSON'
import { mockEradicationLogs } from '../data/mockEradication'

const SPATIAL_LAYERS = [
  {
    id: 'boundaries',
    label: 'Province & LGU Boundaries',
    detail: '4 provinces · 123 LGUs',
  },
  {
    id: 'heatmap',
    label: 'Invasion Heatmap',
    detail: 'Weighted detection density',
  },
  {
    id: 'protected',
    label: 'Protected Watersheds',
    detail: '4 protected landscapes',
  },
  {
    id: 'buffers',
    label: 'Road & River Buffers',
    detail: 'Transport corridors · riparian',
  },
  {
    id: 'elevation',
    label: 'Elevation & Terrain',
    detail: '300–1,200 m upland zones',
  },
  {
    id: 'eradication',
    label: 'Eradication Status',
    detail: 'DENR / LGU action points',
  },
]

const eradicationColors = {
  Reported: '#6b6b6b',
  Scheduled: '#1d4ed8',
  'In Progress': '#b85c08',
  Cleared: '#23855a',
}

const hotspotHeatPoints = mockHotspots.map((spot) => ({
  lat: spot.lat,
  lng: spot.lng,
  status: spot.severity,
}))

const protectedStyle = {
  color: '#23855a',
  weight: 1.2,
  opacity: 0.8,
  dashArray: '3 3',
  fillColor: '#23855a',
  fillOpacity: 0.11,
}

function FlyToHotspot({ hotspot }) {
  const map = useMap()
  const isInitial = useRef(true)

  useEffect(() => {
    if (!hotspot) return
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    map.flyTo([hotspot.lat, hotspot.lng], Math.max(map.getZoom(), 10), {
      duration: 0.7,
    })
  }, [hotspot, map, isInitial])

  return null
}

export function HotspotMap() {
  const [selectedHotspotId, setSelectedHotspotId] = useState('HSP-018')
  const [bufferMeters, setBufferMeters] = useState(500)
  const [heatOpacity, setHeatOpacity] = useState(0.75)
  const [activeLayers, setActiveLayers] = useState({
    boundaries: true,
    heatmap: true,
    protected: true,
    buffers: false,
    elevation: false,
    eradication: true,
  })

  const selectedHotspot =
    mockHotspots.find((spot) => spot.id === selectedHotspotId) || mockHotspots[0]

  const bufferStats = useMemo(
    () => ({
      affectedHa: ((Math.PI * bufferMeters ** 2) / 10000).toFixed(1),
      nearbyProtected: selectedHotspot?.nearbyProtected ?? false,
    }),
    [bufferMeters, selectedHotspot],
  )

  const toggleLayer = (layerId) => {
    setActiveLayers((current) => ({ ...current, [layerId]: !current[layerId] }))
  }

  const threat = threatLevels[selectedHotspot.severity]

  return (
    <div className="mx-auto flex w-full max-w-content flex-col lg:h-[calc(100dvh-48px)] lg:overflow-hidden">
      <div className="shrink-0 px-4 pb-3 pt-4 sm:px-6 sm:pt-5">
        <PageHeader
          title="Hotspot Map"
          description="Spatial decision support for Ilocos Region invasion hotspots, protected zones, and response status."
        >
          <Badge variant="warning" dot>
            18 active hotspots
          </Badge>
          <Badge variant="neutral" className="mono">
            WGS 84
          </Badge>
        </PageHeader>
      </div>

      <div className="mx-4 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-panel sm:mx-6 lg:mb-6 lg:flex-row">
        <div className="relative h-[54vh] min-h-[350px] w-full shrink-0 lg:h-auto lg:min-h-0 lg:flex-1">
          <MapView
            points={hotspotHeatPoints}
            center={[16.95, 120.55]}
            zoom={8}
            showProvinces={activeLayers.boundaries}
            showHeatmap={activeLayers.heatmap}
            heatOpacity={heatOpacity}
            showDetections={false}
            scrollWheelZoom
          >
            <FlyToHotspot hotspot={selectedHotspot} />
            <ScaleControl position="bottomleft" imperial={false} />

            {activeLayers.boundaries &&
              lguBoundaries.map((boundary) => (
                <Polyline
                  key={boundary.name}
                  positions={boundary.coords}
                  pathOptions={{
                    color: '#859187',
                    weight: 1,
                    opacity: 0.45,
                    dashArray: '2 4',
                  }}
                />
              ))}

            {activeLayers.protected && (
              <GeoJSON
                data={protectedAreasGeoJSON}
                style={protectedStyle}
                onEachFeature={(feature, layer) => {
                  layer.bindTooltip(feature.properties.name, {
                    sticky: true,
                    className: 'province-label',
                  })
                }}
              />
            )}

            {activeLayers.buffers &&
              transportCorridors.map((corridor) => {
                const color = corridor.type === 'road' ? '#1d4ed8' : '#0369a1'
                return (
                  <Fragment key={corridor.name}>
                    <Polyline
                      positions={corridor.coords}
                      pathOptions={{
                        color,
                        weight: 16,
                        opacity: 0.055,
                        lineCap: 'round',
                        interactive: false,
                      }}
                    />
                    <Polyline
                      positions={corridor.coords}
                      pathOptions={{
                        color,
                        weight: 1.2,
                        opacity: 0.7,
                        dashArray: corridor.type === 'river' ? '5 4' : undefined,
                      }}
                    />
                  </Fragment>
                )
              })}

            {activeLayers.elevation &&
              elevationZones.map((zone) => (
                <Circle
                  key={zone.name}
                  center={zone.center}
                  radius={zone.radius}
                  pathOptions={{
                    color: '#8a6d3b',
                    weight: 0.9,
                    opacity: 0.55,
                    dashArray: '2 4',
                    fillColor: '#8a6d3b',
                    fillOpacity: 0.035,
                  }}
                >
                  <Tooltip permanent direction="center" className="map-label">
                    {zone.name} · {zone.elevation}
                  </Tooltip>
                </Circle>
              ))}

            {activeLayers.eradication &&
              mockEradicationLogs.map((log) => (
                <CircleMarker
                  key={log.id}
                  center={[log.lat, log.lng]}
                  radius={4}
                  pathOptions={{
                    color: eradicationColors[log.status] || '#a1a1a1',
                    fillColor: eradicationColors[log.status] || '#a1a1a1',
                    fillOpacity: 0.65,
                    weight: 1.2,
                  }}
                >
                  <Popup>
                    <div className="w-[210px] font-sans">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11.5px] font-medium text-ink">{log.location}</p>
                          <p className="mono mt-0.5 text-[9px] text-subtle">{log.id}</p>
                        </div>
                        <Badge status={log.status}>{log.status}</Badge>
                      </div>
                      <div className="mt-2 space-y-1 border-t border-border pt-2 text-[10px] text-muted">
                        <p>{log.species} · {log.area} ha</p>
                        <p className="text-subtle">{log.agency}</p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

            <Circle
              center={[selectedHotspot.lat, selectedHotspot.lng]}
              radius={bufferMeters}
              pathOptions={{
                color: '#23855a',
                weight: 1.4,
                opacity: 0.8,
                dashArray: '5 5',
                fillColor: '#23855a',
                fillOpacity: 0.055,
                interactive: false,
              }}
            />
            <Circle
              center={[selectedHotspot.lat, selectedHotspot.lng]}
              radius={Math.max(50, bufferMeters * 0.55)}
              pathOptions={{
                color: '#23855a',
                weight: 0.8,
                opacity: 0.4,
                dashArray: '2 4',
                fillColor: '#23855a',
                fillOpacity: 0.025,
                interactive: false,
              }}
            />

            {mockHotspots.map((spot) => {
              const spotThreat = threatLevels[spot.severity]
              const selected = spot.id === selectedHotspot.id
              return (
                <Fragment key={spot.id}>
                  {selected && (
                    <CircleMarker
                      center={[spot.lat, spot.lng]}
                      radius={15}
                      interactive={false}
                      pathOptions={{
                        color: '#23855a',
                        weight: 1,
                        opacity: 0.6,
                        dashArray: '2 3',
                        fillOpacity: 0,
                        interactive: false,
                      }}
                    />
                  )}
                  <CircleMarker
                    center={[spot.lat, spot.lng]}
                    radius={selected ? 8 : 5.5}
                    pathOptions={{
                      color: selected ? '#ededed' : spotThreat.color,
                      weight: selected ? 2 : 1,
                      fillColor: spotThreat.color,
                      fillOpacity: 0.9,
                      opacity: 1,
                    }}
                    eventHandlers={{ click: () => setSelectedHotspotId(spot.id) }}
                  >
                  <Popup>
                    <div className="w-[220px] font-sans">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-semibold text-ink">{spot.name}</p>
                          <p className="mt-0.5 text-[9.5px] text-muted">
                            {spot.municipality}, {spot.province}
                          </p>
                        </div>
                        <Badge variant={spot.severity}>{spotThreat.shortLabel}</Badge>
                      </div>
                      <div className="mt-2.5 grid grid-cols-[64px_1fr] gap-y-1.5 border-t border-border pt-2 text-[10px]">
                        <span className="text-subtle">Species</span>
                        <span className="text-right text-muted">{spot.species}</span>
                        <span className="text-subtle">Coordinates</span>
                        <span className="mono text-right text-[9px] text-ink">
                          {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                        </span>
                        <span className="text-subtle">Detections</span>
                        <span className="mono text-right text-muted">{spot.detections}</span>
                        <span className="text-subtle">Affected</span>
                        <span className="mono text-right text-inv-mod">{spot.affectedHa} ha</span>
                      </div>
                      <p className="mt-2 text-[9px] text-subtle">
                        Click marker to load buffer analysis.
                      </p>
                    </div>
                  </Popup>
                  </CircleMarker>
                </Fragment>
              )
            })}
          </MapView>

          <Legend className="absolute left-3 top-3 z-[500] hidden w-[188px] sm:block" />

          <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] w-max max-w-[90%] -translate-x-1/2 rounded-md border border-border bg-panel/95 px-2.5 py-1.5">
            <p className="mono flex items-center gap-1.5 text-[8.5px] text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: threat.color }}
              />
              {selectedHotspot.name} · buffer {bufferMeters} m · {bufferStats.affectedHa} ha
            </p>
          </div>
        </div>

        <LayerPanel
          layers={SPATIAL_LAYERS}
          activeLayers={activeLayers}
          onToggle={toggleLayer}
          heatOpacity={heatOpacity}
          onHeatOpacityChange={setHeatOpacity}
          hotspots={mockHotspots}
          selectedHotspotId={selectedHotspotId}
          onSelectHotspot={setSelectedHotspotId}
          bufferMeters={bufferMeters}
          onBufferChange={setBufferMeters}
          bufferStats={bufferStats}
          className="w-full shrink-0 border-t border-border lg:h-full lg:w-[340px] lg:border-l lg:border-t-0"
        />
      </div>
    </div>
  )
}
