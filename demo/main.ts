import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { notify } from '../src/notify';

createApp(App)
	.use(notify, {
		keys: ['user1', 'user2'],
	})
	.mount('#app');
