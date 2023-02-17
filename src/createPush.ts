import { createID } from './utils';
import { Type } from './constants';
import type { Receiver, UserOptions, PushFn } from './types';

type Options = Partial<UserOptions>;

export function createPush(receiver: Receiver): PushFn {
	function create(options: Options, status = Type.SUCCESS, id = createID()) {
		receiver.incoming.value = { ...options, id, type: status };

		return { id, clear: () => clear(id), clearAll };
	}

	function clear(id: string) {
		receiver.items.find((notification) => notification.id === id)?.clear();
	}

	function clearAll() {
		receiver.items.length = 0;
	}

	function push(options: Options) {
		return create(options);
	}

	push.clearAll = clearAll;

	push.success = (options: Options) => create(options);

	push.error = (options: Options) => create(options, Type.ERROR);

	push.warning = (options: Options) => create(options, Type.WARNING);

	push.info = (options: Options) => create(options, Type.INFO);

	push.promise = ((options) => {
		const { clear, clearAll, id } = create(options, Type.PROMISE);

		return {
			resolve: (options) => create(options, Type.PROMISE_RESOLVE, id),
			reject: (options) => create(options, Type.PROMISE_REJECT, id),
			clear,
			clearAll,
		};
	}) satisfies PushFn['promise'];

	return push;
}
