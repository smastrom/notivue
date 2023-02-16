import { h } from 'vue';
import { ariaRenderer } from './ariaRenderer';
import { featherProps, icons, ionProps } from './icons';
import { getCX as _cx } from './utils';
import type { Notification } from './types';

export function defaultRenderer(notification: Notification, customClass: string) {
	const cx = (block: string) => _cx(block, customClass);

	return h(
		'div',
		{
			class: cx('notification'),
			key: notification.id,
			'data-vuenotify': notification.type,
		},
		[
			h('svg', { 'aria-hidden': true, ...ionProps, class: cx('icon') }, [
				icons[notification.type] ?? icons.success,
			]),

			h('div', { class: cx('content') }, [
				notification.title && h('h3', { class: cx('content-title') }, notification.title),
				notification.message && h('p', { class: cx('content-message') }, notification.message),
			]),

			notification.close &&
				h('button', { class: cx('button'), onClick: notification.clear }, [
					h('svg', { 'aria-hidden': true, ...featherProps }, [icons.close]),
				]),
			ariaRenderer(notification),
		]
	);
}
