import { computed, type Ref, type CSSProperties, ref } from 'vue';
import type { ComponentProps } from './types';

type Params = {
	rootMargin: Ref<ComponentProps['rootMargin']>;
	maxWidth: Ref<ComponentProps['maxWidth']>;
	position: Ref<ComponentProps['position']>;
};

const brBox: CSSProperties = { boxSizing: 'border-box' };

const wrapperStyles: CSSProperties = {
	...brBox,
	position: 'fixed',
	width: '100%',
	height: '100%',
	display: 'flex',
	justifyContent: 'center',
	pointerEvents: 'none',
};

const hoverAreaStyles: CSSProperties = { ...brBox, pointerEvents: 'all' };

export function useReceiverStyles({ rootMargin, maxWidth, position }: Params) {
	const is = (_position: string) => position.value.includes(_position);

	const containerStyles = computed<CSSProperties>(() => ({
		...brBox,
		...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
		padding: `${is('top') ? rootMargin.value.y : 0}px ${is('right') ? rootMargin.value.x : 0}px
			${is('bottom') ? rootMargin.value.y : 0}px ${is('left') ? rootMargin.value.x : 0}px`,
		alignItems: is('top') ? 'start' : 'end',
		justifyItems: is('right') ? 'end' : is('left') ? 'start' : 'center',
		width: '100%',
		display: 'grid',
	}));

	return { wrapperStyles, containerStyles, hoverAreaStyles };
}
