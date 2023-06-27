import { createApp } from 'vue'
import { notivue, lightTheme, filledIcons } from 'notivue'

import App from './components/App.vue'

import '../packages/notivue/core/animations.css'
import '../packages/notivue/Notifications/notifications.css'
import './assets/style.css'

createApp(App)
   .use(notivue, {
      theme: { ...lightTheme /* , '--nv-tip-width': '0.3rem' */ },
      icons: filledIcons,
      notifications: {
         global: { duration: 300000 },
         success: { title: 'Success' },
      },
   })
   .mount('#app')
