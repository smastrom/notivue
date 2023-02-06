import { markRaw } from 'vue';
import { Status } from './constants';
import { icons } from './icons';
import { ComponentOptions } from './types';

export const successDefault: ComponentOptions = {
	type: Status.SUCCESS,
	title: false,
	message: 'Success!',
	icon: markRaw(icons.success),
	close: true,
	duration: 3000,
	ariaLive: 'polite',
	ariaRole: 'status',
};

const errorDefault: ComponentOptions = {
	...successDefault,
	type: Status.ERROR,
	icon: markRaw(icons.error),
	message: 'Error!',
	ariaLive: 'assertive',
	ariaRole: 'alert',
};

const promiseDefault: ComponentOptions = {
	...successDefault,
	type: Status.PROMISE,
	message: 'Loading...',
	close: false,
	duration: Infinity, // This is useless, but it's here for consistency
};

export const defaultOptions: Record<string, ComponentOptions> = {
	[Status.SUCCESS]: successDefault,
	[Status.ERROR]: errorDefault,
	[Status.PROMISE]: promiseDefault,
	[Status.PROMISE_RESOLVE]: successDefault,
	[Status.PROMISE_REJECT]: errorDefault,
};
