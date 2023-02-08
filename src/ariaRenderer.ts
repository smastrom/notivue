import { h } from 'vue';
import type { Notification } from './types';

export function ariaRenderer(notification: Notification) {
	return h(
		'div',
		{ 'aria-live': notification.ariaLive, role: notification.ariaRole, class: 'VueNotify__hidden' },
		`${notification.title ? `${notification.title}:` : ''} ${notification.message || ''}`
	);
}
