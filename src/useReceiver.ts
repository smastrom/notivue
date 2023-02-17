import { inject } from 'vue';
import { userSyms, defaultSym } from './symbols';
import type { Receiver } from './types';

export function useReceiver(key?: string): Pick<Receiver, 'notifications' | 'incoming'> {
	const { notifications, incoming } = inject(
		key && key in userSyms ? userSyms[key] : defaultSym
	) as Receiver;

	return { notifications, incoming };
}
