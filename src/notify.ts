import { ref, type Plugin, type InjectionKey } from 'vue';
import { createPush } from './createPush';
import { VueNotify } from './VueNotify';
import { notifySyms, userSyms } from './symbols';
import { defaultItem } from './defaults';
import { COMPONENT_NAME } from './constants';
import type { PluginOptions, Receiver } from './types';

export const notify: Plugin = {
	install(
		app,
		{ name = COMPONENT_NAME, keys = [] }: PluginOptions = {
			name: COMPONENT_NAME,
			keys: [],
		}
	) {
		const receivers = new Map<InjectionKey<Receiver>, Receiver>();

		keys.forEach((key) => {
			userSyms[key.toString()] = Symbol(key.toString());
		});

		notifySyms.push(...Object.values(userSyms));

		notifySyms.forEach((sym) => {
			receivers.set(sym, {
				container: ref([]),
				incoming: ref({ ...defaultItem, id: '' }),
				push: () => createPush(receivers.get(sym) as Receiver),
			});
		});

		receivers.forEach((value, sym) => {
			app.provide(sym, value);
		});

		app.component(name, VueNotify);
	},
};
