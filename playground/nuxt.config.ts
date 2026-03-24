import { getHead } from './utils/head'

export default defineNuxtConfig({
   // Nuxt 4 defaults to srcDir `app/`; keep sources at project root
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
         minify: import.meta.env.DEV ? false : 'oxc',
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
