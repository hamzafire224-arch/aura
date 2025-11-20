import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'recharts', 'lucide-react'],
          'ai-vendor': ['@anthropic-ai/sdk', '@google/generative-ai'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  preview: {
    port: 4173,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  define: {
    'process.env': {},
  },
})


