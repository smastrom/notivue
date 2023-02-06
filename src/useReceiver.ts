import { inject } from 'vue';
import { userSyms, mainSym } from './symbols';
import type { Receiver } from './types';

// Used internally, not exposed to user
export function useReceiver(key?: string): Pick<Receiver, 'container' | 'incoming'> {
	const { container, incoming } = inject(
		key && key in userSyms ? userSyms[key] : mainSym
	) as Receiver;

	return { container, incoming };
}
