import { createApp } from 'vue'
import { notivue } from 'notivue'

import App from './components/App.vue'

import '@/core/animations.css'
import '@/Notifications/notifications.css'

import './assets/style.css'

createApp(App)
   .use(notivue, {
      notifications: {
         global: {
            /* duration: 30000, */
         },
      },
   })
   .mount('#app')
