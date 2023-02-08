import { h } from 'vue';
import { ariaRenderer } from './ariaRenderer';
import { featherProps, icons } from './icons';
import { Notification } from './types';
import { getCX as _getCX } from './utils';

export function defaultRenderer(
	notification: Notification,
	noDefaultClass: boolean,
	customClass: string
) {
	const getCX = (block: string) => _getCX(block, noDefaultClass, customClass);
	const _ = null;

	return h(
		'div',
		{
			class: getCX('notification'),
			key: notification.id,
			'data-vuenotify': notification.type,
		},
		[
			h('svg', { 'aria-hidden': true, ...featherProps, class: getCX('icon') }, [
				icons[notification.type] ?? icons.success,
			]),

			h('div', { class: getCX('content') }, [
				notification.title ? h('h3', { class: getCX('content-title') }, notification.title) : _,
				notification.message
					? h('p', { class: getCX('content-message') }, notification.message)
					: _,
			]),

			notification.close
				? h('button', { class: getCX('button'), onClick: notification.clear }, [
						h('svg', { 'aria-hidden': true, ...featherProps }, [icons.close]),
				  ])
				: _,

			ariaRenderer(notification),
		]
	);
}
