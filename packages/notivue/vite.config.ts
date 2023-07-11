import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'
import { resolve } from 'path'

export default defineConfig({
   resolve: {
      alias: {
         '@/core': resolve(__dirname, './core'),
         '@/Notivue': resolve(__dirname, './Notivue'),
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
         plugins: [
            terser({
               compress: {
                  drop_console: false,
                  defaults: true,
                  passes: 2,
                  ecma: 2020,
               },
            }),
         ],
      },
   },
   // @ts-ignore
   plugins: [dts({ staticImport: true, insertTypesEntry: true }), vue()],
})
