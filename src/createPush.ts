import { createID } from './utils';
import { Status } from './constants';
import type { ReceiverStore, UserOptions, PushFn } from './types';

export function createPush(receiver: ReceiverStore): PushFn {
	function _clear(id: string) {
		receiver.notifications.value = receiver.notifications.value.filter((item) => item.id !== id);
	}

	function clearAll() {
		receiver.notifications.value = [];
	}

	function push(options: Partial<UserOptions>) {
		const id = createID();
		receiver.incoming.value = { ...options, id };

		return { clear: () => _clear(id), clearAll };
	}

	push.promise = ((options) => {
		const id = createID();
		receiver.incoming.value = { ...options, id, type: Status.PROMISE };

		return {
			resolve: (options) => {
				receiver.incoming.value = { ...options, id, type: Status.PROMISE_RESOLVE };
			},
			reject: (options) => {
				receiver.incoming.value = { ...options, id, type: Status.PROMISE_REJECT };
			},
			clear: () => _clear(id),
			clearAll,
		};
	}) satisfies PushFn['promise'];

	push.clearAll = clearAll;

	return push;
}
