import { fileURLToPath } from 'url'
import { getHead } from './lib/utils'

import nesting from 'postcss-nesting'

export default defineNuxtConfig({
   ssr: true,
   devtools: {
      enabled: true,
   },
   app: {
      head: getHead(),
   },
   vite: {
      css: {
         postcss: {
            plugins: [nesting],
         },
      },
   },
   css: ['assets/style.css', 'notivue/notifications.css', 'notivue/animations.css'],
   alias: {
      '@/lib': fileURLToPath(new URL('./lib', import.meta.url)),
   },
})
