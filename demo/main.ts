import { createApp } from 'vue'
import App from './App.vue'
import { notivue } from '../src'

import '../src/component.css'
import '../src/animations.css'
import './assets/style.css'

createApp(App)
   .use(notivue, {
      register: ['user-1'],
   })
   .mount('#app')
