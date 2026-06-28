import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from "vite-plugin-node-polyfills"
import path from 'path'

export default defineConfig(({ mode }) => {
  // Memuat semua variabel dari env file di workspace, tanpa pembatasan prefix VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      babel({ presets: [reactCompilerPreset()] }),
      react(),
      tailwindcss(),
      nodePolyfills(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Menginjeksikan kredensial dari .env.local secara aman ke dalam definisi compile-time browser
    define: {
      'import.meta.env.RME_ADMIN_EMAIL': JSON.stringify(env.RME_ADMIN_EMAIL),
      'import.meta.env.RME_ADMIN_PASSWORD': JSON.stringify(env.RME_ADMIN_PASSWORD),
      'import.meta.env.WAREHOUSE_ADMIN_EMAIL': JSON.stringify(env.WAREHOUSE_ADMIN_EMAIL),
      'import.meta.env.WAREHOUSE_ADMIN_PASSWORD': JSON.stringify(env.WAREHOUSE_ADMIN_PASSWORD),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@react-pdf') || id.includes('jspdf') || id.includes('html2canvas')) {
                return 'pdf-vendor';
              }
              if (id.includes('recharts') || id.includes('d3')) {
                return 'charts-vendor';
              }
              return 'vendor';
            }
          }
        }
      }
    },

    server: {
      proxy: {
        '/api': {
          target: 'https://midtrans-backend-eight.vercel.app',
          changeOrigin: true,
          secure: false,
        },
        '/proxy/rme': {
          target: 'https://smartclinic-rekam-medis.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/rme/, ''),
        },
        '/proxy/warehouse': {
          target: 'https://system-inventory-management.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/warehouse/, ''),
        },
        '/proxy/ai': {
          target: 'https://dashboard-ai-9k65.onrender.com',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/ai/, ''),
        },
        '/proxy/internal': {
          target: 'https://db-posqris-cpgii-production.up.railway.app',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/proxy\/internal/, ''),
        },
      }
    }
  };
});