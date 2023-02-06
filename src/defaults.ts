import { TypeOption, IncomingItem, Props } from './types';

const successDefault: TypeOption = {
	type: 'success',
	title: false,
	message: 'Success!',
	icon: null, // Replace with render fn
	close: true,
	duration: 3000,
	ariaLive: 'polite',
	ariaRole: 'status',
};

const errorDefault: TypeOption = {
	...successDefault,
	type: 'error',
	message: 'Error!',
	ariaLive: 'assertive',
	ariaRole: 'alert',
};

const promiseDefault: TypeOption = {
	...successDefault,
	type: 'promise',
	message: 'Loading...',
	close: false,
	duration: Infinity, // This is useless, but it's here for consistency
};

export const defaultOptions: Record<string, TypeOption> = {
	success: successDefault,
	error: errorDefault,
	promise: promiseDefault,
	'promise-resolve': successDefault,
	'promise-reject': errorDefault,
};

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
