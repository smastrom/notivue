import { inject } from 'vue';
import { userSyms, mainSym } from './symbols';
import type { ReceiverStore } from './types';

export function useReceiver(key?: string): Pick<ReceiverStore, 'notifications' | 'incoming'> {
	const { notifications, incoming } = inject(
		key && key in userSyms ? userSyms[key] : mainSym
	) as ReceiverStore;

	return { notifications, incoming };
}
