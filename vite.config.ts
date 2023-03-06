import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import terser from '@rollup/plugin-terser'
import cssNesting from 'postcss-nesting'
import cssNano from 'cssnano'

export default defineConfig({
   css: {
      postcss: {
         plugins: [cssNesting, cssNano],
      },
   },
   build: {
      lib: {
         entry: 'src/index.ts',
         name: 'Notsy',
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
                  defaults: true,
               },
            }),
         ],
      },
   },
   plugins: [vue()],
})
