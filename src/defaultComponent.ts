import { h } from 'vue';
import { ariaLive } from './ariaLive';
import { featherProps, icons, ionProps, svgProps } from './icons';
import { Status } from './constants';
import type { Notification } from './types';

const PREFIX = 'VueNotify__';

export function defaultComponent(notification: Notification) {
	return h(
		'div',
		{
			class: PREFIX + 'notification',
			key: notification.id,
			'data-vuenotify': notification.type,
		},
		[
			h(
				'svg',
				{
					'aria-hidden': true,
					...(notification.type === Status.PROMISE
						? { ...svgProps, stroke: 'currentColor' }
						: ionProps),
					class: PREFIX + 'icon',
				},
				[icons[notification.type] ?? icons.success]
			),

			h('div', { class: PREFIX + 'content' }, [
				notification.title && h('h3', { class: PREFIX + 'content-title' }, notification.title),
				notification.message && h('p', { class: PREFIX + 'content-message' }, notification.message),
			]),

			notification.close &&
				h('button', { class: PREFIX + 'button', onClick: notification.clear }, [
					h('svg', { 'aria-hidden': true, ...featherProps }, [icons.close]),
				]),
			ariaLive(notification),
		]
	);
}
