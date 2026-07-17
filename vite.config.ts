import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'

// const modeIndex = process.argv.indexOf('--mode')
// const mode = modeIndex !== -1 ? process.argv[modeIndex + 1] : 'dist'
// console.log('---',mode)
export default defineConfig(({ command, mode }) => {
  console.log('---',command)
  return {
    plugins: [react(), visualizer({
      open: false,              // 构建完自动打开报告
      gzipSize: true,          // 显示 gzip 后的大小
      brotliSize: true,        // 显示 brotli 后的大小
      filename: 'dist/stats.html',
      template: 'treemap',     // treemap（默认）| sunburst | network | list
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // outDir: `${mode}`,
    assetsInlineLimit: 1024 * 1024 * 2,  // 官方默认是 4096
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
