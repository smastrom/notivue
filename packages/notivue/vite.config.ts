import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'

export const terserConf = {
   compress: {
      drop_console: true,
      defaults: true,
      passes: 2,
   },
}

const isWatch = process.argv.includes('--watch')

const path = (url: string) => fileURLToPath(new URL(url, import.meta.url))

export default defineConfig({
   resolve: {
      alias: {
         '@/core': path('./core'),
         '@/Notivue': path('./Notivue'),
         '@/NotivueSwipe': path('./NotivueSwipe'),
         '@/NotivueKeyboard': path('./NotivueKeyboard'),
         '@/Notifications': path('./Notifications'),
         notivue: path('./index.ts'),
      },
   },
   build: {
      emptyOutDir: isWatch ? false : true,
      lib: {
         entry: 'index.ts',
         name: 'Notivue',
         fileName: 'index',
         formats: ['es'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
         plugins: [isWatch ? undefined : terser(terserConf)],
      },
   },
   plugins: [
      dts({
         rollupTypes: true,
      }),
      vue(),
      postBuild(),
   ],
})

function postBuild() {
   return {
      name: 'post-build',
      buildEnd() {
         if (!terserConf.compress.drop_console) {
            throw new Error('terserConf.compress.drop_console must be true')
         }
      },
   }
}
