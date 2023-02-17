import { computed, type Ref, type CSSProperties } from 'vue';
import type { ComponentProps } from './types';

type Params = {
	margin: Ref<ComponentProps['margin']>;
	maxWidth: Ref<ComponentProps['maxWidth']>;
	placement: Ref<ComponentProps['placement']>;
};

const brBox: CSSProperties = { boxSizing: 'border-box' };

export function useReceiverStyles({ margin, maxWidth, placement }: Params) {
	const is = (position: string) => placement.value.includes(position);

	const wrapperStyles: CSSProperties = {
		...brBox,
		position: 'fixed',
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		pointerEvents: 'none',
	};

	const containerStyles = computed<CSSProperties>(() => ({
		...brBox,
		...(maxWidth.value ? { maxWidth: `${maxWidth.value}px` } : {}),
		padding: `${is('top') ? margin.value.y : 0}px ${is('right') ? margin.value.x : 0}px
			${is('bottom') ? margin.value.y : 0}px ${is('left') ? margin.value.x : 0}px`,
		alignItems: is('top') ? 'start' : 'end',
		justifyItems: is('right') ? 'end' : is('left') ? 'start' : 'center',
		width: '100%',
		display: 'grid',
	}));

	const hoverAreaStyles: CSSProperties = { ...brBox, pointerEvents: 'all' };

	return { wrapperStyles, containerStyles, hoverAreaStyles };
}
