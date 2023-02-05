import { Component, defineComponent, h, PropType } from 'vue';

export const IconRender = defineComponent({
	name: 'IconRender',
	props: {
		icons: {
			type: Object as PropType<{ error: Component }>,
			required: false,
			default: () => ({ error: null }),
		},
	},
	setup(props) {
		return () => h(props.icons.error);
	},
});
