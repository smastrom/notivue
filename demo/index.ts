import { createApp } from 'vue'
import { notivue, light, filledIcons } from 'notivue'

import App from './components/app/App.vue'

import '../packages/notivue/styles/notifications.css'
import '../packages/notivue/styles/animations.css'
import './assets/style.css'

createApp(App)
   .use(notivue, {
      theme: light,
      icons: filledIcons,
      notifications: {
         global: { duration: 500000 },
         success: { title: 'Success' },
      },
   })
   .mount('#app')
