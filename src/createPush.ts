import { createID } from './utils';
import type { Receiver, IncomingItem, PushFunction } from './types';

export function createPush(receiver: Receiver): PushFunction {
	function push(options: IncomingItem) {
		const id = createID();
		receiver.incoming.value = { ...options, id };

		return { clear: () => clear(id), clearAll };
	}

	function clearAll() {
		receiver.container.value = [];
	}

	function clear(id: string) {
		receiver.container.value = receiver.container.value.filter((item) => item.id !== id);
	}

	push.promise = (options: IncomingItem) => {
		const id = createID();
		receiver.incoming.value = { ...options, id, type: 'promise' };

		return {
			resolve: (options: IncomingItem) => {
				receiver.incoming.value = { ...options, id, type: 'promise-resolve' };
			},
			reject: (options: IncomingItem) => {
				receiver.incoming.value = { ...options, id, type: 'promise-reject' };
			},
			clear: () => clear(id),
			clearAll,
		};
	};

	push.clearAll = clearAll;

	return push;
}
