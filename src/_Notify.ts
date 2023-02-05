import { defineComponent, h, type PropType as PT } from 'vue';
import { useNotify, useReceiver } from './notify';
import type { Props as P } from './types';

const DEFAULT_TIMEOUT = 3000;
const FIXED_INCREMENT = 200;

export const Notify = defineComponent({
	name: 'VueNotify',
	inheritAttrs: false,
	props: {
		method: { type: String as PT<P['method']>, default: 'unshift' },
		limit: { type: Number as PT<P['limit']>, default: 10 },
		pauseOnHover: { type: Boolean as PT<P['pauseOnHover']>, default: true },
		placement: { type: String as PT<P['placement']>, default: 'top-right' },
		position: { type: String as PT<P['position']>, default: 'fixed' },
		key: { type: String as PT<P['key']>, default: '' },
		customClass: { type: String as PT<P['customClass']>, default: '' },
		noDefaultClass: { type: Boolean as PT<P['noDefaultClass']>, default: false },
		transitionName: { type: String as PT<P['transitionName']>, default: 'VueNotify' },
		options: { type: Object as PT<P['options']>, default: () => ({}) },
	},
	setup(props) {
		const { container, incoming } = useReceiver();
		const push = useNotify();

		return () => h('div', 'Hello World');
	},
});
