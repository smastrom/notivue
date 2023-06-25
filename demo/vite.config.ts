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
         notivue: resolve(__dirname, '../packages/notivue/index.ts'),
         '@/lib': resolve(__dirname, './lib'),
         '@/components': resolve(__dirname, './components'),
      },
   },
   plugins: [vue()],
})
