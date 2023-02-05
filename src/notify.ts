import { reactive, ref, inject, type Plugin, type Ref, type InjectionKey } from 'vue';
import { Notify } from './_Notify';
import { Incoming, PushOptions, PushFunction } from './types';

type PluginOptions = {
	name?: string;
	keys?: string[];
};

export type Receiver = {
	container: Ref<any[]>;
	incoming: Ref<Incoming>;
	push: () => PushFunction;
};

const createID = () => crypto.randomUUID();

export const mainSym = Symbol('') as InjectionKey<Receiver>;
export const userSyms: Record<string, InjectionKey<Receiver>> = {};

const defaultIcoming: Incoming = {
	type: 'success',
	id: '',
	title: 'Notification',
	message: 'Message',
	icon: null,
	close: true,
	duration: 3000,
	ariaLive: 'polite',
	ariaRole: 'status',
};

export const defaultData = {
	container: ref([]),
	incoming: ref(defaultIcoming),
};

const notifySyms: InjectionKey<Receiver>[] = [mainSym];

const componentName = 'VueNotify';

function createPush(receiver: Receiver): PushFunction {
	function clearAll() {
		receiver.container.value = [];
	}

	function clear(id: string) {
		receiver.container.value = receiver.container.value.filter((item) => item.id !== id);
	}

	function push(options: PushOptions) {
		const id = createID();

		receiver.incoming.value = { ...options, id };

		return { clear: () => clear(id), clearAll };
	}

	push.promise = (options: PushOptions) => {
		const id = createID();

		receiver.incoming.value = { ...options, id, type: 'promise' };

		return {
			resolve: (options: PushOptions) => {
				receiver.incoming.value = { ...options, id, type: 'resolve' };
			},
			reject: (options: PushOptions) => {
				receiver.incoming.value = { ...options, id, type: 'reject' };
			},
			clear: () => clear(id),
			clearAll,
		};
	};

	push.clearAll = clearAll;

	return push;
}

export function useNotify(key?: string): PushFunction {
	const { push } = inject(key && key in userSyms ? userSyms[key] : mainSym) as Receiver;
	return push();
}

export function useReceiver(key?: string): Pick<Receiver, 'container' | 'incoming'> {
	const { container, incoming } = inject(
		key && key in userSyms ? userSyms[key] : mainSym
	) as Receiver;
	return { container, incoming };
}

export const notify: Plugin = {
	install(
		app,
		{ name = componentName, keys = [] }: PluginOptions = {
			name: componentName,
			keys: [],
		}
	) {
		const receivers = reactive(new Map<InjectionKey<Receiver>, Receiver>());

		keys.forEach((key) => {
			userSyms[key.toString()] = Symbol(key.toString());
		});

		notifySyms.push(...Object.values(userSyms));

		notifySyms.forEach((sym) => {
			receivers.set(sym, {
				container: ref([]),
				incoming: ref(defaultIcoming),
				push: () => createPush(receivers.get(sym) as Receiver),
			});
		});

		receivers.forEach((value, key) => {
			app.provide(key, value);
		});

		app.component(name, Notify);
	},
};
