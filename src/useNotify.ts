import { inject } from 'vue';
import { userSyms, mainSym } from './symbols';
import type { Receiver, PushFn } from './types';

export function useNotify(key?: string): PushFn {
	const { push } = inject(key && key in userSyms ? userSyms[key] : mainSym) as Receiver;

	return push();
}
