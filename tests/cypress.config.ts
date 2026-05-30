import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'cypress'

import { alias } from './shared-config'

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
            server: {
               port: 5176,
            },
            resolve: {
               alias,
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
