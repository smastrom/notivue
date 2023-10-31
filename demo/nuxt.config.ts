import { getHead } from './utils/head'

export default defineNuxtConfig({
   modules: ['floating-vue/nuxt', 'notivue/nuxt'],
   ssr: true,
   devtools: {
      enabled: true,
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
         // Never use lightningcss - https://github.com/parcel-bundler/lightningcss/issues/288
         cssMinify: 'esbuild',
      },
      css: {
         transformer: 'lightningcss',
         lightningcss: {
            drafts: {
               nesting: true,
            },
         },
      },
   },
   css: ['assets/style.css', 'notivue/notifications.css', 'notivue/animations.css'],
})
