import { inject } from 'vue';
import { userSyms, mainSym } from './symbols';
import type { ReceiverStore, PushFn } from './types';

export function useNotify(key?: string): PushFn {
	const { push } = inject(key && key in userSyms ? userSyms[key] : mainSym) as ReceiverStore;

	return push();
}
