import { defineConfig } from 'astro/config'

import vue from '@astrojs/vue'
import react from '@astrojs/react'

/** Examples use `push` from `notivue/astro` for regression testing; `notify` is the same object. */
export default defineConfig({
   integrations: [
      vue({
         appEntrypoint: '/src/pages/_app.ts',
         devtools: true,
      }),
      react(),
   ],
   vite: {
      optimizeDeps: {
         include: ['notivue', 'notivue/astro'],
      },
      ssr: {
         noExternal: ['notivue'],
      },
   },
})
