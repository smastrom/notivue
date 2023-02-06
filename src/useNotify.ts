import { inject } from 'vue';
import { userSyms, mainSym } from './symbols';
import type { Receiver, PushFunction } from './types';

export function useNotify(key?: string): PushFunction {
	const { push } = inject(key && key in userSyms ? userSyms[key] : mainSym) as Receiver;

	return push();
}
