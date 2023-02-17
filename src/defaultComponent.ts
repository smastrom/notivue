import { h, isVNode, VNode } from 'vue';
import { ariaLive } from './ariaLive';
import { icons } from './icons';
import { CLASS_PREFIX } from './constants';
import type { Notification } from './types';

function renderIcon(icon: unknown) {
	if (isVNode(icon)) {
		return icon;
	}
	if (typeof icon === 'object') {
		return h(icon as object, { class: CLASS_PREFIX + 'icon' });
	}
	return null;
}

export function defaultComponent(notification: Notification) {
	return h(
		'div',
		{
			class: CLASS_PREFIX + 'notification',
			key: notification.id,
			'data-vuenotify': notification.type,
		},
		[
			renderIcon(notification.icon),

			h('div', { class: CLASS_PREFIX + 'content' }, [
				notification.title &&
					h('h3', { class: CLASS_PREFIX + 'content-title' }, notification.title),
				notification.message &&
					h('p', { class: CLASS_PREFIX + 'content-message' }, notification.message),
			]),

			notification.close &&
				h('button', { class: CLASS_PREFIX + 'close', onClick: notification.clear }, [icons.close]),
			ariaLive(notification),
		]
	);
}
