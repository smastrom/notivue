import type { TypeOption } from './types';

export const FIXED_INCREMENT = 200;

export const defaultItem: TypeOption = {
	type: 'success',
	title: '',
	message: '',
	icon: null,
	close: true,
	duration: 3000,
	ariaLive: 'polite',
	ariaRole: 'status',
};

export const componentName = 'VueNotify';
