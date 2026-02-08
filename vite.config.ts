import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification
    minify: 'esbuild',
    // Code splitting - create separate chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split node_modules into vendor chunk
          if (id.includes('node_modules')) {
            // Keep heavy editor separate (only loaded when needed)
            if (id.includes('@tiptap')) {
              return 'editor-vendor';
            }
            // Everything else in one vendor bundle to ensure proper load order
            return 'vendor';
          }
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Source maps for debugging (can disable for smaller builds)
    sourcemap: false,
  },
  // Enable compression for dev server too
  server: {
    host: true,
  },
})
