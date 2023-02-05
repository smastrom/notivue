import { reactive, ref, type Plugin, type Ref } from 'vue';
import { Notify } from './_Notify';

type PluginOptions = {
	name?: string;
	keys?: string[];
};

type ReceiverData = {
	container: Ref<any[]>;
	incoming: Ref<{ id: string; message: string }>;
};

type ConsumerData = {
	useNotify: () => void;
};

declare module 'vue' {
	interface ComponentCustomProperties {
		$notify: () => void;
	}
}

const componentName = 'VueNotify';

const mainSymb = Symbol('vue_notify');
const userSymb: Record<string, symbol> = {};

const appKeys: Symbol[] = [mainSymb];

export const notify: Plugin = {
	install(
		app,
		{ name = componentName, keys = [] }: PluginOptions = {
			name: componentName,
			keys: [],
		}
	) {
		const receivers = reactive(new Map<string, ReceiverData & ConsumerData>());

		keys.forEach((key) => (userSymb[key.toString()] = Symbol(key.toString())));

		appKeys.push(...Object.values(userSymb));

		appKeys.forEach((key) => {
			const globalFn = key === mainSymb ? '$notify' : `$notify_${key.toString()}`;

			app.config.globalProperties[globalFn] = () => {};

			receivers.set(key.toString(), {
				container: ref([]),
				incoming: ref({ id: '', message: '' }),
				useNotify: () => {},
			});

			app.provide(key, receivers.get(key.toString()));
		});

		app.component(name, Notify);
	},
};
