import { getHead } from './utils/head'

import nesting from 'postcss-nesting'

export default defineNuxtConfig({
   modules: ['floating-vue/nuxt', '@nuxtjs/notivue'],
   ssr: true,
   devtools: {
      enabled: true,
   },
   notivue: {
      // position: 'top-right',
      notifications: {
         global: {
            // duration: Infinity,
         },
      },
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
})
