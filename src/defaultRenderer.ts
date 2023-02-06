import { h } from 'vue';
import { featherProps, icons } from './icons';
import { ContainerItem } from './types';

export function defaultRenderer(notification: ContainerItem) {
	return h(
		'div',
		{
			class: 'Toast',
			key: notification.id,
			'data-vuenotify': notification.type,
		},
		[
			h('svg', { 'aria-hidden': true, ...featherProps, class: 'Toast__icon' }, [
				icons[notification.type] ?? icons.success,
			]),
			h('p', { class: 'Toast__message' }, notification.message),
			h('button', { class: 'Toast__button', onClick: notification.clear }, [
				h('svg', { 'aria-hidden': true, ...featherProps }, [icons.close]),
			]),
		]
	);
}
