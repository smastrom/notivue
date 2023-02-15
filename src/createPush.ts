import { createID } from './utils';
import { Status } from './constants';
import type { Receiver, UserOptions, PushFn } from './types';

type Options = Partial<UserOptions>;

export function createPush(receiver: Receiver): PushFn {
	function create(options: Options, status = Status.SUCCESS, id = createID()) {
		receiver.incoming.value = { ...options, id, type: status };

		return { id, clear: () => clear(id), clearAll };
	}

	function clear(id: string) {
		const toRemove = receiver.notifications.findIndex((data) => data.id === id);
		receiver.notifications.splice(toRemove, 1);
	}

	function clearAll() {
		receiver.notifications.length = 0;
	}

	function push(options: Options) {
		return create(options);
	}

	push.clearAll = clearAll;

	push.success = (options: Options) => create(options);

	push.error = (options: Options) => create(options, Status.ERROR);

	push.warning = (options: Options) => create(options, Status.WARNING);

	push.info = (options: Options) => create(options, Status.INFO);

	push.promise = ((options) => {
		const { clear, clearAll, id } = create(options, Status.PROMISE);

		return {
			resolve: (options) => create(options, Status.PROMISE_RESOLVE, id),
			reject: (options) => create(options, Status.PROMISE_REJECT, id),
			clear,
			clearAll,
		};
	}) satisfies PushFn['promise'];

	return push;
}
