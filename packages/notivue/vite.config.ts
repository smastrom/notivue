import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
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
