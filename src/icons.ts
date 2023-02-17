import { h } from 'vue';
import { Type, CLASS_PREFIX } from './constants';

const className = { class: CLASS_PREFIX + 'icon' };

export const svgProps = {
	xmlns: 'http://www.w3.org/2000/svg',
	width: 24,
	height: 24,
	viewBox: '0 0 24 24',
	'aria-hidden': 'true',
};

export const ionProps = {
	...svgProps,
	...className,
	fill: 'currentColor',
	viewBox: '0 0 12 12',
};

export const featherProps = {
	...svgProps,
	class: CLASS_PREFIX + 'close-icon',
	stroke: 'currentColor',
	'stroke-width': 2,
	'stroke-linecap': 'round',
	'stroke-linejoin': 'round',
};

const success = h('svg', ionProps, [
	h('path', {
		d: 'M6,-0c-3.308,-0 -6,2.692 -6,6c-0,3.308 2.692,6 6,6c3.308,-0 6,-2.692 6,-6c-0,-3.308 -2.692,-6 -6,-6Zm3.123,3.989l-3.877,4.616c-0.086,0.102 -0.213,0.162 -0.346,0.164l-0.008,0c-0.131,0 -0.256,-0.055 -0.343,-0.153l-1.662,-1.846c-0.081,-0.085 -0.126,-0.199 -0.126,-0.316c0,-0.254 0.209,-0.462 0.462,-0.462c0.135,0 0.263,0.059 0.35,0.161l1.307,1.451l3.536,-4.209c0.087,-0.101 0.215,-0.159 0.349,-0.159c0.253,-0 0.461,0.208 0.461,0.461c0,0.107 -0.036,0.21 -0.103,0.292Z',
	}),
]);

const error = h('svg', ionProps, [
	h('path', {
		d: 'M6,-0c-3.308,-0 -6,2.692 -6,6c-0,3.308 2.692,6 6,6c3.308,-0 6,-2.692 6,-6c-0,-3.308 -2.692,-6 -6,-6Zm-0,9.228c-0.316,0 -0.577,-0.26 -0.577,-0.577c0,-0.316 0.261,-0.577 0.577,-0.577c0.316,0 0.577,0.261 0.577,0.577c-0,0.317 -0.261,0.577 -0.577,0.577Zm0.627,-5.802l-0.166,3.519c-0,0.253 -0.208,0.462 -0.462,0.462c-0.253,-0 -0.461,-0.209 -0.461,-0.462l-0.166,-3.518l0,-0.001c-0,-0.009 -0,-0.018 -0,-0.027c-0,-0.344 0.283,-0.627 0.627,-0.627c0.344,0 0.627,0.283 0.627,0.627c-0,0.009 -0,0.018 -0.001,0.027l0.002,-0Z',
	}),
]);

const info = h('svg', ionProps, [
	h('path', {
		d: 'M6,0c-3.308,0 -6,2.692 -6,6c0,3.308 2.692,6 6,6c3.308,0 6,-2.692 6,-6c0,-3.308 -2.692,-6 -6,-6Zm0,2.46c0.428,0 0.78,0.352 0.78,0.78c-0,0.428 -0.352,0.78 -0.78,0.78c-0.428,0 -0.78,-0.352 -0.78,-0.78c0,-0.428 0.352,-0.78 0.78,-0.78Zm1.44,6.78l-2.64,0c-0.263,0 -0.48,-0.217 -0.48,-0.48c0,-0.263 0.217,-0.48 0.48,-0.48l0.84,0l0,-2.64l-0.48,0c-0.263,0 -0.48,-0.217 -0.48,-0.48c0,-0.263 0.217,-0.48 0.48,-0.48l0.96,0c0.263,0 0.48,0.217 0.48,0.48l0,3.12l0.84,0c0.263,0 0.48,0.217 0.48,0.48c0,0.263 -0.217,0.48 -0.48,0.48Z',
	}),
]);

const anShared = {
	dur: '1.5s',
	calcMode: 'spline',
	repeatCount: 'indefinite',
	keyTimes: '0;0.475;0.95;1',
	keySplines: '0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1',
};

const promise = h('svg', { ...svgProps, ...className, stroke: 'currentColor' }, [
	h('g', [
		h(
			'circle',
			{ cx: 12, cy: 12, r: 9.5, fill: 'none', 'stroke-width': 3.3, 'stroke-linecap': 'round' },
			[
				h('animate', {
					...anShared,
					attributeName: 'stroke-dasharray',
					values: '0 150;42 150;42 150;42 150',
				}),
				h('animate', {
					...anShared,
					attributeName: 'stroke-dashoffset',
					values: '0;-16;-59;-59',
				}),
			]
		),
		h('animateTransform', {
			attributeName: 'transform',
			type: 'rotate',
			dur: '2s',
			values: '0 12 12;360 12 12',
			repeatCount: 'indefinite',
		}),
	]),
]);

const close = [
	h('svg', featherProps, [
		h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
		h('line', { x1: 6, y1: 6, x2: 18, y2: 18 }),
	]),
];

export const icons = {
	[Type.SUCCESS]: success,
	[Type.ERROR]: error,
	[Type.INFO]: info,
	[Type.WARNING]: error,
	[Type.PROMISE]: promise,
	[Type.PROMISE_RESOLVE]: success,
	[Type.PROMISE_REJECT]: error,
	close,
};
