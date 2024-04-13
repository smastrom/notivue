import { getHead } from './utils/head'

export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
   ssr: true,
   experimental: {
      componentIslands: true,
   },
   notivue: {
      // addPlugin: true,
      // startOnCreation: true,
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
   css: [
      'assets/style.css',
      'notivue/notifications.css',
      'notivue/notifications-progress.css',
      'notivue/animations.css',
   ],
})
