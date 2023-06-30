import { createApp } from 'vue'
import { notivue } from 'notivue'

import App from './components/App.vue'

import '../packages/notivue/core/animations.css'
import '../packages/notivue/Notifications/notifications.css'
import './assets/style.css'

createApp(App)
   .use(notivue, {
      notifications: {
         global: { duration: 300000 },
         success: { title: 'Success' },
      },
   })
   .mount('#app')
