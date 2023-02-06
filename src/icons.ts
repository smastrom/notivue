import { h } from 'vue';

const success = [
	h('circle', { cx: 12, cy: 12, r: 10 }),
	h('polyline', { points: '9 11 12 14 22 4' }),
];

const error = [
	h('circle', { cx: 12, cy: 12, r: 10 }),
	h('line', { x1: 12, y1: 8, x2: 12, y2: 12 }),
	h('line', { x1: 12, y1: 16, x2: 12.01, y2: 16 }),
];

const promise = [
	h('g', { class: 'VueNotify_Spinner' }, [
		h('circle', { cx: 12, cy: 12, r: 9.5, fill: 'none', 'stroke-width': 3 }),
	]),
];

const close = [
	h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
	h('line', { x1: 6, y1: 6, x2: 18, y2: 18 }),
];

export const icons = {
	close,
	error,
	success,
	promise,
	'promise-resolve': success,
	'promise-reject': error,
};

export const featherProps = {
	xmlns: 'http://www.w3.org/2000/svg',
	width: 24,
	height: 24,
	viewBox: '0 0 24 24',
	fill: 'none',
	stroke: 'currentColor',
	'stroke-width': 2,
	'stroke-linecap': 'round',
	'stroke-linejoin': 'round',
};
