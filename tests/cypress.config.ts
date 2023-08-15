import { defineConfig } from 'cypress'
import { resolve } from 'path'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
   video: false,
   viewportWidth: 1280,
   viewportHeight: 720,
   experimentalMemoryManagement: true,
   component: {
      devServer: {
         framework: 'vue',
         bundler: 'vite',
         viteConfig: {
            resolve: {
               alias: {
                  '@/support': resolve(__dirname, './cypress/support'),
                  '@/tests': resolve(__dirname, './'),

                  '@/core': resolve(__dirname, '../packages/notivue/core'),
                  '@/Notivue': resolve(__dirname, '../packages/notivue/Notivue'),
                  '@/Notifications': resolve(__dirname, '../packages/notivue/Notifications'),
               },
            },
            plugins: [vue()],
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
