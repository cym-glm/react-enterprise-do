import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// const modeIndex = process.argv.indexOf('--mode')
// const mode = modeIndex !== -1 ? process.argv[modeIndex + 1] : 'dist'
// console.log('---',mode)
export default defineConfig(({ command, mode }) => {
  console.log('---',command)
  return {
    plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // outDir: `${mode}`,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
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
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   build: {
//     outDir: `${mode}`,
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://cnodejs.org/api/v1',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// })
