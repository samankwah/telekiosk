import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for third-party libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI chunk for UI components
          ui: [
            './src/components/ui/ImageCarousel.jsx',
            './src/components/ui/ScrollToTop.jsx',
            './src/components/ui/ScrollToTopButton.jsx',
            './src/components/ui/SkeletonLoader.jsx'
          ],
          // Services chunk for service-related components
          services: [
            './src/services/resendEmailService.js',
            './src/services/meetingService.js'
          ]
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify for production
    minify: 'esbuild' // Use esbuild instead of terser (faster and built-in)
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Server configuration for development
  server: {
    port: 5174,
    host: true,
    open: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: true,
      port: 24680
    },
    // Fix WebSocket connection issues
    strictPort: false,
    fs: {
      allow: ['..']
    }
  },
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  }
})
