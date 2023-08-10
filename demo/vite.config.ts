import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
   css: {
      transformer: 'lightningcss',
      lightningcss: {
         drafts: {
            nesting: true,
         },
      },
   },
   build: {
      cssMinify: 'lightningcss',
   },
   resolve: {
      alias: {
         '@/lib': resolve(__dirname, './lib'),
         '@/components': resolve(__dirname, './components'),

         notivue: resolve(__dirname, '../packages/notivue/index.ts'),
         '@/core': resolve(__dirname, '../packages/notivue/core'),
         '@/Notivue': resolve(__dirname, '../packages/notivue/Notivue'),
         '@/NotivueSwipe': resolve(__dirname, '../packages/notivue/NotivueSwipe'),
         '@/NotivueKeyboard': resolve(__dirname, '../packages/notivue/NotivueKeyboard'),
         '@/Notifications': resolve(__dirname, '../packages/notivue/Notifications'),
      },
   },
   plugins: [vue()],
})
