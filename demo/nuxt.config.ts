import { getHead } from './utils/head'

export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
   ssr: true,
   devtools: {
      enabled: false,
   },
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
      esbuild: {
         minifyIdentifiers: !import.meta.env.DEV,
         minifySyntax: !import.meta.env.DEV,
      },
      build: {
         minify: import.meta.env.DEV ? false : 'esbuild',
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
