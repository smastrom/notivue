import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import postCSSNesting from 'postcss-nesting'

export default defineConfig({
   css: {
      postcss: {
         plugins: [postCSSNesting],
      },
   },
   resolve: {
      alias: {
         '@/lib': resolve(__dirname, './lib'),
         '@/components': resolve(__dirname, './components'),

         notivue: resolve(__dirname, '../packages/notivue/index.ts'),
         '@/core': resolve(__dirname, '../packages/notivue/core'),
         '@/Notivue': resolve(__dirname, '../packages/notivue/Notivue'),
         '@/Notifications': resolve(__dirname, '../packages/notivue/Notifications'),
         '@/types': resolve(__dirname, '../packages/notivue/types.ts'),
      },
   },
   plugins: [vue()],
})
