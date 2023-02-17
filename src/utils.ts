import { nextTick } from 'vue';
import { Status } from './constants';
import { defaultOptions } from './defaults';
import type { UserOptions, UserOptionsWithInternals, ComponentProps } from './types';

export function createID() {
	return crypto ? crypto.randomUUID() : (Math.random() + 1).toString(36).substring(7);
}

export function mergeOptions(
	type: string = Status.SUCCESS,
	componentOptions: ComponentProps['options'] = {},
	pushOptions: UserOptions & { id: string }
): UserOptionsWithInternals {
	return { ...defaultOptions[type], ...componentOptions[type], ...pushOptions };
}

/**
 * This calculates proper transform-origin just right after the root element has been mounted,
 * in order to avoid undesidered flying animations.
 * Prevents this to happen https://github.com/vuejs/vue/issues/11654.
 */
export function calcOrigin(el: HTMLElement, placement: ComponentProps['placement']) {
	const notification = el.children[0].children[0]?.children[0];

	if (!notification) {
		return 'center top';
	}

	const { left, right, top, width } = notification.getBoundingClientRect();
	const wOffset = Math.abs(width - notification.clientWidth);
	const xOffset = placement.includes('left')
		? `${left + wOffset}px`
		: placement.includes('right')
		? `${right - wOffset}px`
		: 'center';
	const yOffset = placement.includes('bottom') ? `${top}px` : 'top';

	return `${xOffset} ${yOffset}`;
}
