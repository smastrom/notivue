import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { notify } from '../src/notify';

import '../src/css/transitions.css';
import '../src/css/core.css';
import '../src/css/blocks.css';

createApp(App)
	.use(notify, {
		keys: ['user1', 'user2'],
	})
	.mount('#app');
