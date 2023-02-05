import { defineComponent, h } from 'vue';

export const Notify = defineComponent({
	name: 'VueNotify',
	props: {},
	setup(props) {
		return () => h('div', 'Hello World');
	},
});
