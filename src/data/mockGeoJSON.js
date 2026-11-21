export const region1GeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Ilocos Norte',
        code: 'PH-ILN',
        center: [18.34, 120.68],
        lgus: 21,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.45, 18.75],
            [120.8, 18.7],
            [121.05, 18.55],
            [121.2, 18.35],
            [121.15, 18.05],
            [120.95, 17.95],
            [120.5, 17.92],
            [120.35, 18.1],
            [120.28, 18.35],
            [120.32, 18.55],
            [120.45, 18.75],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Ilocos Sur',
        code: 'PH-ILS',
        center: [17.42, 120.62],
        lgus: 34,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.5, 17.92],
            [120.95, 17.95],
            [121.05, 17.65],
            [120.9, 17.2],
            [120.75, 16.95],
            [120.5, 16.85],
            [120.35, 17.15],
            [120.3, 17.5],
            [120.4, 17.8],
            [120.5, 17.92],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'La Union',
        code: 'PH-LUN',
        center: [16.61, 120.48],
        lgus: 20,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.35, 16.85],
            [120.75, 16.95],
            [120.8, 16.5],
            [120.6, 16.32],
            [120.35, 16.3],
            [120.22, 16.5],
            [120.25, 16.7],
            [120.35, 16.85],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Pangasinan',
        code: 'PH-PAN',
        center: [15.88, 120.18],
        lgus: 48,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.22, 16.5],
            [120.35, 16.3],
            [120.6, 16.32],
            [120.82, 16.0],
            [120.65, 15.6],
            [120.4, 15.25],
            [120.15, 15.2],
            [119.9, 15.45],
            [119.75, 15.9],
            [119.8, 16.2],
            [120.0, 16.4],
            [120.22, 16.5],
          ],
        ],
      },
    },
  ],
}

export const protectedAreasGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Paoay Lake Protected Landscape',
        type: 'Protected landscape',
        declaredHa: 340,
        center: [18.118, 120.535],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.51, 18.135],
            [120.555, 18.14],
            [120.575, 18.115],
            [120.56, 18.095],
            [120.525, 18.098],
            [120.505, 18.115],
            [120.51, 18.135],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Manleluag Spring Protected Landscape',
        type: 'Protected landscape',
        declaredHa: 723,
        center: [15.705, 120.31],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.28, 15.73],
            [120.33, 15.75],
            [120.35, 15.7],
            [120.32, 15.67],
            [120.27, 15.68],
            [120.28, 15.73],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Banaoang Protected Landscape',
        type: 'Protected landscape',
        declaredHa: 460,
        center: [17.35, 120.55],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.53, 17.36],
            [120.58, 17.37],
            [120.6, 17.34],
            [120.57, 17.31],
            [120.52, 17.32],
            [120.53, 17.36],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Bessang Pass Natural Monument',
        type: 'Natural monument',
        declaredHa: 158,
        center: [16.94, 120.63],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.6, 16.97],
            [120.66, 16.975],
            [120.67, 16.93],
            [120.63, 16.91],
            [120.59, 16.94],
            [120.6, 16.97],
          ],
        ],
      },
    },
  ],
}

export const lguBoundaries = [
  {
    name: 'Pasuquin – Bacarra',
    coords: [
      [18.32, 120.57],
      [18.3, 120.64],
      [18.34, 120.69],
    ],
  },
  {
    name: 'Laoag – San Nicolas',
    coords: [
      [18.16, 120.54],
      [18.14, 120.61],
      [18.2, 120.65],
    ],
  },
  {
    name: 'Vigan – Bantay',
    coords: [
      [17.59, 120.36],
      [17.56, 120.43],
      [17.53, 120.48],
    ],
  },
  {
    name: 'Narvacan – Santa',
    coords: [
      [17.42, 120.42],
      [17.46, 120.51],
      [17.4, 120.61],
    ],
  },
  {
    name: 'San Fernando – Bauang',
    coords: [
      [16.7, 120.31],
      [16.63, 120.38],
      [16.59, 120.45],
    ],
  },
  {
    name: 'Dagupan – Mangaldan',
    coords: [
      [16.1, 120.36],
      [16.13, 120.44],
      [16.05, 120.5],
    ],
  },
  {
    name: 'Lingayen – Bugallon',
    coords: [
      [16.1, 120.1],
      [16.0, 120.17],
      [15.94, 120.26],
    ],
  },
]

export const transportCorridors = [
  {
    type: 'road',
    name: 'Manila North Road',
    coords: [
      [18.55, 120.6],
      [18.2, 120.59],
      [17.6, 120.4],
      [16.8, 120.36],
      [16.3, 120.4],
      [15.95, 120.35],
      [15.7, 120.35],
    ],
  },
  {
    type: 'road',
    name: 'Ilocos–Cordillera Link',
    coords: [
      [17.6, 120.42],
      [17.3, 120.58],
      [16.95, 120.65],
      [16.6, 120.58],
      [16.25, 120.6],
      [15.9, 120.64],
    ],
  },
  {
    type: 'river',
    name: 'Abra River',
    coords: [
      [17.6, 120.5],
      [17.35, 120.55],
      [17.1, 120.5],
      [16.85, 120.42],
      [16.6, 120.36],
      [16.3, 120.33],
    ],
  },
  {
    type: 'river',
    name: 'Agno River',
    coords: [
      [16.25, 120.75],
      [16.15, 120.55],
      [16.05, 120.44],
      [15.9, 120.38],
      [15.8, 120.3],
      [15.7, 120.2],
    ],
  },
]

export const elevationZones = [
  {
    name: 'Cordillera Foothills',
    center: [18.1, 120.9],
    radius: 18000,
    elevation: '450–1,200 m',
  },
  {
    name: 'Ilocos Sur Highlands',
    center: [17.2, 120.82],
    radius: 15000,
    elevation: '300–980 m',
  },
  {
    name: 'Bessang Pass Uplands',
    center: [16.94, 120.64],
    radius: 11000,
    elevation: '280–760 m',
  },
  {
    name: 'Pangasinan Interior',
    center: [15.84, 120.55],
    radius: 16000,
    elevation: '80–420 m',
  },
]
