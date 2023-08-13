import { defineConfig, transformWithEsbuild } from 'vite'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync } from 'fs'

import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const path = (url: string) => fileURLToPath(new URL(url, import.meta.url))

const isFinalBundle = !process.argv.includes('--watch')

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
      emptyOutDir: isFinalBundle,
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
      onBundleClose(),
   ],
})

/**
 * Esbuild options defined in vite config are somehow
 * ignored or do not work so let's do it manually.
 */
function onBundleClose() {
   return {
      name: 'esbuild-minify',
      async closeBundle() {
         const module = readFileSync('dist/index.js', { encoding: 'utf8' }).toString()
         const { code } = await transformWithEsbuild(module, 'index.js', {
            minifyWhitespace: true,
            target: 'es2020',
            drop: isFinalBundle ? ['console'] : [],
         })

         writeFileSync('dist/index.js', code)
      },
   }
}
