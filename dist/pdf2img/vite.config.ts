import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default ({mode}) => defineConfig({
    plugins: [vue()],
    // development    production
    base: mode === 'development' ? '/' : './',
    optimizeDeps: {
        include: ['pdfjs-dist']
    }
})
