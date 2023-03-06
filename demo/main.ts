import { createApp } from 'vue'
import App from './App.vue'
import { notsy } from '../src'

import './style.css'
import '../src/component.css'
import '../src/animations.css'

createApp(App)
   .use(notsy, {
      additionalReceivers: ['user-1'],
   })
   .mount('#app')
