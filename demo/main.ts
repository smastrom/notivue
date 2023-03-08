import { createApp } from 'vue'
import App from './App.vue'
import { notivue } from '../src'

import './style.css'
import '../src/component.css'
import '../src/animations.css'

createApp(App)
   .use(notivue, {
      additionalReceivers: ['user-1'],
   })
   .mount('#app')
