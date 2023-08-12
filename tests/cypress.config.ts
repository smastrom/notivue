import { defineConfig } from 'cypress'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
   video: false,
   viewportWidth: 1280,
   viewportHeight: 720,
   component: {
      devServer: {
         framework: 'vue',
         bundler: 'vite',
         viteConfig: {
            resolve: {
               alias: {
                  '@/support': resolve(__dirname, './cypress/support'),

                  '@/core': resolve(__dirname, '../packages/notivue/core'),
                  '@/Notivue': resolve(__dirname, '../packages/notivue/Notivue'),
                  '@/NotivueSwipe': resolve(__dirname, '../packages/notivue/NotivueSwipe'),
                  '@/NotivueKeyboard': resolve(__dirname, '../packages/notivue/NotivueKeyboard'),
                  '@/Notifications': resolve(__dirname, '../packages/notivue/Notifications'),
               },
            },
            plugins: [vue(), vueJsx()],
         },
      },
      setupNodeEvents(on) {
         on('task', {
            log(message) {
               console.log(message)
               return null
            },
         })
      },
   },
})
