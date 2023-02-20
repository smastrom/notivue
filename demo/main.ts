import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { notify } from '../src/notify'

import '../src/notification.css'

createApp(App)
   .use(notify, {
      additionalReceivers: ['user-1'],
   })
   .mount('#app')
