import { defineConfig } from 'vite'
import path from 'path'


import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


// https://vite.dev/config/
export default defineConfig({
  // base: '/',
  server: {
    port: 3002,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:81',
        changeOrigin: true,
      },
      '/panelapi': {
        target: 'http://localhost:81',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [
    TanStackRouterVite(),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },

  build: {
    manifest: true,
    outDir: 'build',
    rollupOptions: {
      //   output: {
      //     // Define the file name pattern to avoid underscores
      //     entryFileNames: 'assets/[name].[hash].js',
      //     chunkFileNames: 'assets/cf_[name].[hash].js',
      //     assetFileNames: 'assets/[name].[hash].[ext]',
      //   },
      input: {
        app: './prod.html',
      },
    },
  },
})
