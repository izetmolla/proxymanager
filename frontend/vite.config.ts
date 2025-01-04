import { defineConfig } from 'vite'
import path from 'path'


import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'



const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        "[[globalOptions]]",
        `{"setup": false, "credentialsLogin": true, "googleLogin": false, "githubLogin": false}`,
      )
    },
  }
}



export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    // base: '/',
    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:81',
          changeOrigin: true,
        },
        '/auth': {
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
      isDev && htmlPlugin()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },

    build: {
      manifest: true,
      outDir: 'build',
    },
  }
})
