import { ref, type Plugin, type InjectionKey } from 'vue';
import { createPush } from './createPush';
import { VueNotify } from './VueNotify';
import { notifySyms, userSyms } from './symbols';
import { successDefault } from './defaults';
import { COMPONENT_NAME } from './constants';
import type { PluginOptions, ReceiverStore } from './types';

export const notify: Plugin = {
	install(
		app,
		{ name = COMPONENT_NAME, keys = [] }: PluginOptions = {
			name: COMPONENT_NAME,
			keys: [],
		}
	) {
		const receivers = new Map<InjectionKey<ReceiverStore>, ReceiverStore>();

		keys.forEach((key) => {
			userSyms[key.toString()] = Symbol(key.toString());
		});

		Object.freeze(userSyms);

		notifySyms.push(...Object.values(userSyms));

		notifySyms.forEach((sym) => {
			receivers.set(sym, {
				notifications: ref([]),
				incoming: ref({ ...successDefault, id: '' }),
				push: () => createPush(receivers.get(sym) as ReceiverStore),
			});
		});

		receivers.forEach((value, sym) => {
			app.provide(sym, value);
		});

		app.component(name, VueNotify);
	},
};
