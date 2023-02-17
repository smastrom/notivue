import { markRaw } from 'vue';
import { NType } from './constants';
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

const promise: ComponentOptions = {
	...success,
	icon: markRaw(icons.promise),
	title: 'Loading...',
	close: false,
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

export const defaultOptions: Record<`${NType}`, ComponentOptions> = {
	[NType.SUCCESS]: success,
	[NType.ERROR]: error,
	[NType.WARNING]: warning,
	[NType.INFO]: info,
	[NType.PROMISE]: promise,
	[NType.PROMISE_RESOLVE]: success,
	[NType.PROMISE_REJECT]: error,
};
