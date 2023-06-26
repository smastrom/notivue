import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'

export default defineConfig({
   resolve: {
      alias: {
         '@/core': resolve(__dirname, './core'),
         '@/types': resolve(__dirname, './types.ts'),
         '@/Notivue': resolve(__dirname, './Notivue'),
         '@/Notifications': resolve(__dirname, './Notifications'),
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
   plugins: [
      dts({ staticImport: true, insertTypesEntry: true }),
      vue(),
      visualizer({ emitFile: true, filename: 'stats.html', gzipSize: true }),
   ],
})
