import { readFileSync } from 'node:fs'

import { getHead } from './utils/head'

const { version } = JSON.parse(readFileSync('../packages/notivue/package.json', 'utf-8'))

export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
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
      define: {
         __NOTIVUE_VERSION__: JSON.stringify(version),
      },
      optimizeDeps: {
         include: ['luxon'],
      },
      css: {
         transformer: 'lightningcss',
      },
      build: {
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
