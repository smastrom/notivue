import { createApp } from 'vue'
import { notivue } from '../src'
import App from './App.vue'

import '../src/notifications.css'
import '../src/animations.css'

import './assets/style.css'

createApp(App)
   .use(notivue, {
      register: ['user-1'],
   })
   .mount('#app')
