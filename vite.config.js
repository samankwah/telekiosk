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
          // Chatbot chunk for AI features
          chatbot: [
            './src/components/chatbot/ChatBot.jsx',
            './src/components/chatbot/ChatInterface.jsx',
            './src/components/chatbot/VoiceButton.jsx',
            './src/services/chatbotService.js',
            './src/services/voiceService.js'
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
    port: 3000,
    host: true,
    // Enable HMR for better development experience
    hmr: {
      overlay: false
    }
  },
  // Preview configuration
  preview: {
    port: 4173,
    host: true
  }
})
