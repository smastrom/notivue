import { Status } from './constants';
import { defaultOptions } from './defaults';
import type { UserOptions, UserOptionsWithInternals, ComponentProps } from './types';

export function createID() {
	return crypto ? crypto.randomUUID() : (Math.random() + 1).toString(36).substring(7);
}

export function mergeOptions(
	type: string = Status.SUCCESS,
	componentOptions: ComponentProps['options'] = {},
	incomingOptions: UserOptions & { id: string }
): UserOptionsWithInternals {
	return { ...defaultOptions[type], ...componentOptions[type], ...incomingOptions };
}

export function getCX(block: string, noDefaultClass: boolean, customClass?: string): string {
	return `${noDefaultClass ? '' : `VueNotify__${block}`} ${
		customClass ? `${customClass}_${block}` : ''
	}`.trim();
}
