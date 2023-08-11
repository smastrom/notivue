import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'
import { resolve } from 'path'

export const terserConf = {
   compress: {
      drop_console: true,
      defaults: true,
      passes: 2,
   },
}

export default defineConfig({
   resolve: {
      alias: {
         '@/core': resolve(__dirname, './core'),
         '@/Notivue': resolve(__dirname, './Notivue'),
         '@/NotivueSwipe': resolve(__dirname, './NotivueSwipe'),
         '@/NotivueKeyboard': resolve(__dirname, './NotivueKeyboard'),
         '@/Notifications': resolve(__dirname, './Notifications'),
         notivue: resolve(__dirname, './index.ts'),
      },
   },
   build: {
      lib: {
         entry: 'index.ts',
         name: 'Notivue',
         fileName: 'index',
         formats: ['es', 'cjs'],
      },
      rollupOptions: {
         external: ['vue'],
         output: {
            globals: {
               vue: 'Vue',
            },
         },
         plugins: [terser(terserConf)],
      },
   },
   plugins: [
      dts({
         staticImport: true,
         insertTypesEntry: true,
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
