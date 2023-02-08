import { markRaw } from 'vue';
import { Status } from './constants';
import { icons } from './icons';
import type { ComponentOptions } from './types';

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
	duration: 6000,
	message: 'Error!',
	ariaLive: 'assertive',
	ariaRole: 'alert',
};

const promiseDefault: ComponentOptions = {
	...successDefault,
	type: Status.PROMISE,
	message: 'Loading...',
	close: false,
	duration: Infinity,
};

const promiseSuccessDef: ComponentOptions = {
	...successDefault,
	type: Status.PROMISE_RESOLVE,
};

const promiseErrorDef: ComponentOptions = {
	...errorDefault,
	type: Status.PROMISE_REJECT,
};

export const defaultOptions: Record<string, ComponentOptions> = {
	[Status.SUCCESS]: successDefault,
	[Status.ERROR]: errorDefault,
	[Status.PROMISE]: promiseDefault,
	[Status.PROMISE_RESOLVE]: promiseSuccessDef,
	[Status.PROMISE_REJECT]: promiseErrorDef,
};
