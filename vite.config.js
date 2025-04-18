import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    svgr(),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
      },
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
      ],
      manifest: {
        name: 'Prop Fusion',
        short_name: 'PFCRM',
        description: 'Prop Fusion is best CRM for property developers',
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: '#171717',
        background_color: '#8e8bf2',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'charts': ['recharts', 'react-apexcharts', 'apexcharts'],
          'ui': ['lucide-react', 'react-hot-toast'],
          'dashboard': [
            './src/components/dashboard/sections/DashboardSummary.jsx',
            './src/components/dashboard/sections/PropertyStatsSection.jsx',
            // ... other dashboard components
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1200, // Increase the warning limit if needed
  }
})