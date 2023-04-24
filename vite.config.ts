import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import terser from '@rollup/plugin-terser'
import cssNesting from 'postcss-nesting'
import cssNano from 'cssnano'

export default defineConfig(({ mode }) => {
   if (mode === 'demo') {
      return {
         css: {
            postcss: {
               plugins: [cssNesting, cssNano],
            },
         },
         plugins: [vue()],
      }
   }
   return {
      css: {
         postcss: {
            plugins: [cssNesting, cssNano],
         },
      },
      build: {
         lib: {
            entry: 'src/index.ts',
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
      plugins: [dts({ staticImport: true, insertTypesEntry: true }), vue()],
   }
})
