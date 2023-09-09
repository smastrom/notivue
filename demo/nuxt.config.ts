import { getHead } from './utils/head'

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
      build: {
         cssMinify: 'lightningcss',
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
