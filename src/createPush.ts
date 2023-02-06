import { createID } from './utils';
import type { ReceiverStore, Notification, PushFn } from './types';
import { Status } from './constants';

export function createPush(receiver: ReceiverStore): PushFn {
	function clear(id: string) {
		receiver.notifications.value = receiver.notifications.value.filter((item) => item.id !== id);
	}

	function clearAll() {
		receiver.notifications.value = [];
	}

	function push(options?: Partial<Notification>) {
		const id = createID();
		receiver.incoming.value = { ...options, id };

		return { clear: () => clear(id), clearAll };
	}

	push.promise = (options?: Partial<Notification>) => {
		const id = createID();
		receiver.incoming.value = { ...options, id, type: Status.PROMISE };

		return {
			resolve: (options?: Partial<Notification>) => {
				receiver.incoming.value = { ...options, id, type: Status.PROMISE_RESOLVE };
			},
			reject: (options?: Partial<Notification>) => {
				receiver.incoming.value = { ...options, id, type: Status.PROMISE_REJECT };
			},
			clear: () => clear(id),
			clearAll,
		};
	};

	push.clearAll = clearAll;

	return push;
}
