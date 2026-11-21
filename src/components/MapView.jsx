import { useEffect, useMemo, useRef } from 'react'
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'
import { region1GeoJSON } from '../data/mockGeoJSON'
import { threatLevels } from '../data/mockScans'
import { Badge } from './Badge'

const MAP_TILES =
  'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
const MAP_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const heatGradient = {
  0.12: '#23855a',
  0.3: '#5f8114',
  0.52: '#b85c08',
  0.76: '#c92a1d',
  1: '#8f1d14',
}

function HeatmapLayer({ points, opacity = 0.75, radius = 34, blur = 25 }) {
  const map = useMap()
  const layerRef = useRef(null)

  const heatPoints = useMemo(
    () =>
      points.map((point) => [
        point.lat,
        point.lng,
        threatLevels[point.status]?.intensity ?? 0.5,
      ]),
    [points],
  )

  useEffect(() => {
    if (!map || heatPoints.length === 0) return undefined

    const layer = L.heatLayer(heatPoints, {
      radius,
      blur,
      maxZoom: 12,
      max: 1,
      minOpacity: 0.12,
      gradient: heatGradient,
    })
    layer.addTo(map)
    layerRef.current = layer

    return () => {
      if (map.hasLayer(layer)) map.removeLayer(layer)
      layerRef.current = null
    }
  }, [map, heatPoints, radius, blur])

  useEffect(() => {
    if (layerRef.current?._canvas) {
      layerRef.current._canvas.style.opacity = String(opacity)
      layerRef.current._canvas.style.transition = 'opacity 150ms ease'
    }
  }, [opacity, heatPoints])

  return null
}

const provinceStyle = {
  color: '#6c7b71',
  weight: 1,
  opacity: 0.9,
  fillColor: '#23855a',
  fillOpacity: 0.035,
  dashArray: '3 4',
}

function onEachProvince(feature, layer) {
  layer.bindTooltip(feature.properties.name, {
    permanent: true,
    direction: 'center',
    className: 'province-label',
    opacity: 0.9,
  })
}

function DetectionMarker({ point }) {
  const threat = threatLevels[point.status] || threatLevels.low
  const radius = point.status === 'high' ? 7 : point.status === 'moderate' ? 6 : 5

  return (
    <CircleMarker
      center={[point.lat, point.lng]}
      radius={radius}
      pathOptions={{
        color: threat.color,
        fillColor: threat.color,
        fillOpacity: 0.86,
        weight: 1.5,
        opacity: 1,
      }}
    >
      <Popup>
        <div className="w-[214px] font-sans">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[12px] font-semibold text-ink">{point.species}</p>
              <p className="mono mt-0.5 text-[9.5px] italic text-muted">{point.scientificName}</p>
            </div>
            <Badge variant={point.status}>{threat.shortLabel}</Badge>
          </div>
          <div className="mt-2.5 grid grid-cols-[58px_1fr] gap-y-1.5 border-t border-border pt-2 text-[10px]">
            <span className="text-subtle">Location</span>
            <span className="text-right text-muted">
              {point.municipality}, {point.province}
            </span>
            <span className="text-subtle">Coordinates</span>
            <span className="mono text-right text-[9.5px] text-ink">
              {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
            </span>
            <span className="text-subtle">Detected</span>
            <span className="mono text-right text-[9.5px] text-muted">{point.date}</span>
            <span className="text-subtle">Confidence</span>
            <span className="mono text-right text-[9.5px] text-brand">{point.confidence}%</span>
          </div>
          <p className="mono mt-2 border-t border-border pt-1.5 text-[8.5px] text-subtle">
            {point.id}
          </p>
        </div>
      </Popup>
    </CircleMarker>
  )
}

export function MapView({
  points = [],
  center = [16.85, 120.55],
  zoom = 8,
  showProvinces = true,
  showHeatmap = true,
  heatOpacity = 0.75,
  showDetections = true,
  scrollWheelZoom = false,
  className = '',
  children,
}) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={7}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom={scrollWheelZoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution={MAP_ATTRIBUTION}
          url={MAP_TILES}
          maxZoom={19}
        />

        {showProvinces && (
          <GeoJSON
            data={region1GeoJSON}
            style={provinceStyle}
            onEachFeature={onEachProvince}
          />
        )}

        {showHeatmap && <HeatmapLayer points={points} opacity={heatOpacity} />}

        {showDetections &&
          points.map((point) => <DetectionMarker key={point.id} point={point} />)}

        {children}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  )
}
