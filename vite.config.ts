import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import terser from '@rollup/plugin-terser';

export default defineConfig({
   build: {
      lib: {
         entry: 'src/index.ts',
         name: 'VueNotify',
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
});
