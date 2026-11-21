
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/invasive_species/'

export default defineConfig({
  base,

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      includeAssets: [
        'favicon.svg',
        'apple-touch-icon.png',
      ],

      manifest: {
        name: 'IAPS Region 1 Web GIS Monitor',
        short_name: 'IAPS Monitor',
        description:
          'AI-assisted Invasive Alien Plant Species detection and GIS mapping for the Ilocos Region.',

        theme_color: '#1c1c1c',
        background_color: '#1c1c1c',
        display: 'standalone',
        orientation: 'portrait-primary',

        start_url: base,
        scope: base,

        categories: [
          'productivity',
          'utilities',
          'government',
        ],

        icons: [
          {
            src: `${base}pwa-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}pwa-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${base}pwa-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,ico,woff,woff2}',
        ],

        navigateFallback: `${base}index.html`,

        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/server\.arcgisonline\.com\/ArcGIS\/rest\/services\/Canvas\/World_Dark_Gray_Base\/.*/i,

            handler: 'CacheFirst',

            options: {
              cacheName: 'esri-dark-map-tiles',

              expiration: {
                maxEntries: 600,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern:
              /^https:\/\/fonts\.googleapis\.com\/.*/i,

            handler: 'StaleWhileRevalidate',

            options: {
              cacheName: 'google-fonts-css',

              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern:
              /^https:\/\/fonts\.gstatic\.com\/.*/i,

            handler: 'CacheFirst',

            options: {
              cacheName: 'google-fonts-webfonts',

              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
