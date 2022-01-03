import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [vue(), Components()],
  css: {
    preprocessorOptions: {
      scss: {
        // and local and vuetify variables globally
        additionalData: `
              @import '@/assets/style/variables.scss';
              @import '@/assets/style/main.scss';
            `
      },
      sass: {
        // override vuetify variables by local variables
        additionalData: `
              @import '@/assets/style/variables.scss';
              @import '@/assets/style/main.scss';
            `
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  define: {
    'process.env': {}
  }
})
