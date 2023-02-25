import { createApp } from 'vue'
import App from './App.vue'
import { notify } from '../src/notify'

import './style.css'
import '../src/notification.css'
import '../src/animations.css'

createApp(App)
   .use(notify, {
      additionalReceivers: ['user-1'],
   })
   .mount('#app')
