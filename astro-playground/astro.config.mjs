import { defineConfig } from 'astro/config'

import vue from '@astrojs/vue'
import react from '@astrojs/react'

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
         include: ['notivue'],
      },
   },
})
