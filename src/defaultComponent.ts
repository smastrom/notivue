import { h } from 'vue';
import { icons } from './icons';
import { CLASS_PREFIX } from './constants';
import { hIcon } from './utils';
import type { Notification } from './types';

export function defaultComponent(notification: Notification) {
	return h(
		'div',
		{
			class: CLASS_PREFIX + 'notification',
			'data-vuenotify': notification.type,
		},
		[
			hIcon(notification.icon),

			h('div', { class: CLASS_PREFIX + 'content' }, [
				notification.title &&
					h('h3', { class: CLASS_PREFIX + 'content-title' }, notification.title),
				notification.message &&
					h('p', { class: CLASS_PREFIX + 'content-message' }, notification.message),
			]),

			notification.close &&
				h(
					'button',
					{ class: CLASS_PREFIX + 'close', ariaLabel: 'Close', onClick: notification.clear },
					[icons.close]
				),
		]
	);
}
