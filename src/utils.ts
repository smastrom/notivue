import { TypeOption, IncomingItem, Props } from './types';
import { defaultOptions } from './defaults';

export function createID() {
	return crypto ? crypto.randomUUID() : (Math.random() + 1).toString(36).substring(7);
}

export function mergeOptions(
	type: string = 'success',
	componentOptions: Props['options'] = {},
	incomingOptions: IncomingItem
): TypeOption {
	return { ...defaultOptions[type], ...componentOptions[type], ...incomingOptions };
}
