import { getHead } from './utils/head'

/** App sources intentionally use `push` (not `notify`) for regression testing; both APIs are equivalent. */
export default defineNuxtConfig({
   srcDir: '.',
   modules: ['notivue/nuxt'],
   ssr: true,
   devtools: {
      enabled: false,
   },
   experimental: {
      componentIslands: true,
   },
   notivue: {
      notifications: {
         global: {},
      },
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   app: {
      head: getHead(),
   },
   vite: {
      optimizeDeps: {
         include: ['luxon'],
      },
      css: {
         transformer: 'lightningcss',
      },
      build: {
         minify: !import.meta.env.DEV,
         cssMinify: 'lightningcss',
      },
   },
   css: [
      'assets/style.css',
      'notivue/notifications.css',
      'notivue/notifications-progress.css',
      'notivue/animations.css',
   ],
})
