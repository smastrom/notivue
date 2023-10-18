import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const path = (url: string) => fileURLToPath(new URL(url, import.meta.url))

const isFinalBundle = !process.argv.includes('--watch')

export default defineConfig({
   resolve: {
      alias: {
         '@/core': path('./core'),
         '@/shared': path('./shared'),
         '@/Notivue': path('./Notivue'),
         '@/NotivueSwipe': path('./NotivueSwipe'),
         '@/NotivueKeyboard': path('./NotivueKeyboard'),
         '@/Notifications': path('./Notifications'),
         notivue: path('./index.ts'),
      },
   },
   esbuild: {
      drop: isFinalBundle ? ['console'] : [],
   },
   build: {
      emptyOutDir: isFinalBundle,
      target: 'es2015',
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
      },
   },
   plugins: [
      dts({
         rollupTypes: true,
      }),
      vue(),
   ],
})
