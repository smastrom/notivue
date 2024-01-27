import { getHead } from './utils/head'

export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
   ssr: true,
   experimental: {
      componentIslands: true,
   },
   notivue: {
      // addPlugin: true,
      notifications: {
         global: {
            // duration: Infinity,
         },
      },
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   app: {
      head: getHead(),
   },
   vite: {
      build: {
         cssMinify: 'lightningcss',
      },
      css: {
         transformer: 'lightningcss',
      },
   },
   css: ['assets/style.css', 'notivue/notifications.css', 'notivue/animations.css'],
})
