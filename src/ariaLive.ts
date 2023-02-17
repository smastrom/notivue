import { h } from 'vue';
import type { Notification } from './types';

const style = {
	clip: 'rect(0 0 0 0)',
	'clip-path': 'inset(50%)',
	height: '1px',
	overflow: 'hidden',
	position: 'absolute',
	'white-space': 'nowrap',
	width: '1px',
};

export function ariaLive(notification: Notification) {
	return h(
		'div',
		{ 'aria-live': notification.ariaLive, role: notification.ariaRole, style },
		`${notification.title ? `${notification.title}:` : ''} ${notification.message || ''}`
	);
}
