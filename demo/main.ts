import { createApp } from 'vue'
import { notivue, light, filledIcons } from '../src'

import App from './components/app/App.vue'

import '../src/styles/notifications.css'
import '../src/styles/animations.css'
import './assets/style.css'

createApp(App)
   .use(notivue, {
      theme: light,
      icons: filledIcons,
      options: {
         success: { title: 'Success' },
      },
   })
   .mount('#app')
