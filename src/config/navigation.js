import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Leaf,
  Map,
  ScanLine,
} from 'lucide-react'

export const NAV_GROUPS = [
  {
    label: 'Monitoring',
    items: [
      {
        to: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Regional overview and detection trends',
      },
      {
        to: '/scanner',
        label: 'AI Scanner',
        icon: ScanLine,
        description: 'Capture or upload a field image',
      },
      {
        to: '/map',
        label: 'Hotspot Map',
        icon: Map,
        description: 'Spatial layers and buffer analysis',
      },
    ],
  },
  {
    label: 'Data',
    items: [
      {
        to: '/species',
        label: 'Species Database',
        icon: Leaf,
        description: 'Target species and training data',
      },
      {
        to: '/eradication',
        label: 'Eradication Logs',
        icon: ClipboardList,
        description: 'DENR and LGU action tracker',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        to: '/reports',
        label: 'Reports',
        icon: BarChart3,
        description: 'Model evaluation and exports',
      },
    ],
  },
]

export const PAGE_LABELS = {
  '/': 'Dashboard',
  '/scanner': 'AI Scanner',
  '/map': 'Hotspot Map',
  '/species': 'Species Database',
  '/eradication': 'Eradication Logs',
  '/reports': 'Reports',
}
