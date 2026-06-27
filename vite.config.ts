import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from "vite-plugin-node-polyfills"
import path from 'path'

export default defineConfig({
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
})