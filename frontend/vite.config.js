import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Production optimizations
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
      },
    },
    sourcemap: false, // Disable source maps for production
    rollupOptions: {
      output: {
        // Code splitting for better caching
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'axios',
            'react-markdown',
            'prismjs',
            'highlight.js'
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
  server: {
    // Development server config
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
