import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { compression } from 'vite-plugin-compression2'
export default defineConfig(({ command, mode }) => {
  console.log('---',command)
  return {
    plugins: [react({
      babel: {
        plugins: command === 'bui3ld' ? [
          ['babel-plugin-import', { libraryName: 'antd', libraryDirectory: 'es', style: false }],
        ] : [],
      },
    }),
      // gzip + brotli
      // compression({
      //   algorithms: ['gzip', 'brotliCompress'],
      //   threshold: 1024 * 500,
      // }),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true

    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // outDir: `${mode}`,
    // chunkSizeWarningLimit: 1024 * 1024 * 1,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames(assetInfo) {
          const fileName = assetInfo.names[0] || ''
          const ext = fileName.split('.').pop()?.toLowerCase()
          if (ext === 'css') {
            return 'assets/css/[name]-[hash][extname]'
          }
          if (
            ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'ico'].includes(
              ext || '',
            )
          ) {
            return 'assets/img/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // manualChunks(id) {
        //   if (!id.includes('node_modules')) return
        //   if (
        //     id.includes('/react/') ||
        //     id.includes('/react-dom/') ||
        //     id.includes('/react-router-dom/')
        //   ) {
        //     return 'react'
        //   }
        //   if (id.includes('/antd/')) {
        //     return 'antd'
        //   }
        //   if (id.includes('/echarts/')) {
        //     return 'echarts'
        //   }
        // }
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-vendor': ['antd'],
          'utils': ['axios', 'zustand'],
          'echarts': ['echarts'],
          'user-order': ['src/pages/User.tsx', 'src/pages/Order.tsx'],
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://cnodejs.org/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  }
});