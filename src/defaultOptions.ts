import { markRaw } from 'vue';
import { Type } from './constants';
import { icons } from './icons';
import type { ComponentOptions } from './types';

export const success: ComponentOptions = {
	title: 'Success!',
	message: '',
	icon: markRaw(icons.success),
	close: true,
	duration: 3000,
	ariaLive: 'polite',
	ariaRole: 'status',
};

const error: ComponentOptions = {
	...success,
	icon: markRaw(icons.error),
	duration: 6000,
	title: 'Error!',
	ariaLive: 'assertive',
	ariaRole: 'alert',
};

const promiseDefault: ComponentOptions = {
	...success,
	icon: markRaw(icons.promise),
	title: 'Loading...',
	close: false,
	duration: Infinity,
};

const warning: ComponentOptions = {
	...error,
	icon: markRaw(icons.warning),
	title: 'Warning!',
};

const info: ComponentOptions = {
	...success,
	icon: markRaw(icons.info),
	title: 'Info!',
};

const promiseResolve: ComponentOptions = {
	...success,
};

const promiseReject: ComponentOptions = {
	...error,
};

export const defaultOptions: Record<`${Type}`, ComponentOptions> = {
	[Type.SUCCESS]: success,
	[Type.ERROR]: error,
	[Type.WARNING]: warning,
	[Type.INFO]: info,
	[Type.PROMISE]: promiseDefault,
	[Type.PROMISE_RESOLVE]: promiseResolve,
	[Type.PROMISE_REJECT]: promiseReject,
};
