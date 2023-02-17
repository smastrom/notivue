import { defaultOptions } from './defaultOptions';
import { h, isVNode, Ref } from 'vue';
import type { UserOptions, MergedOptions, ComponentProps, InternalPushOptions } from './types';
import { CLASS_PREFIX } from './constants';

export function createID() {
	return crypto ? crypto.randomUUID() : (Math.random() + 1).toString(36).substring(7);
}

export function mergeOptions(
	componentOptions: ComponentProps['options'],
	pushOptions: UserOptions & InternalPushOptions
): MergedOptions {
	return {
		...defaultOptions[pushOptions.type],
		...componentOptions[pushOptions.type],
		...pushOptions,
	};
}

/**
 * This calculates proper transform-origin just right after the root
 * element has been mounted, in order to avoid undesidered flying animations.
 * Prevents this to happen https://github.com/vuejs/vue/issues/11654.
 */
export function getOrigin(el: HTMLElement, position: Ref<ComponentProps['position']>) {
	const notification = el.children[0].children[0]?.children[0];

	if (!notification) {
		return 'center top';
	}

	const { left, right, top, width } = notification.getBoundingClientRect();
	const wOffset = Math.abs(width - notification.clientWidth);
	const xOffset = position.value.includes('left')
		? `${left + wOffset}px`
		: position.value.includes('right')
		? `${right - wOffset}px`
		: 'center';
	const yOffset = position.value.includes('bottom') ? `${top}px` : 'top';

	return `${xOffset} ${yOffset}`;
}

export function hIcon(icon: unknown) {
	if (isVNode(icon)) {
		return icon;
	}
	if (typeof icon === 'object') {
		return h(icon as object, { class: CLASS_PREFIX + 'icon' });
	}
	return null;
}
