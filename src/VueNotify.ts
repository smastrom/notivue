import {
	Component,
	defineComponent,
	h,
	ref,
	Transition,
	TransitionGroup,
	watch,
	type PropType,
	type Raw,
} from 'vue';
import { useReceiver } from './useReceiver';
import { mergeOptions } from './utils';
import { FIXED_INCREMENT, Status } from './constants';
import { defaultRenderer } from './defaultRenderer';
import type { ComponentProps as Props, UserOptionsWithDefaults } from './types';

export const VueNotify = defineComponent({
	name: 'VueNotify',
	inheritAttrs: false,
	props: {
		key: { type: String as PropType<Props['key']>, default: '' }, // OK
		method: { type: String as PropType<Props['method']>, default: 'unshift' }, // OK
		limit: { type: Number as PropType<Props['limit']>, default: 10 }, // OK
		pauseOnHover: { type: Boolean as PropType<Props['pauseOnHover']>, default: true }, // OK
		placement: { type: String as PropType<Props['placement']>, default: 'top-right' },
		position: { type: String as PropType<Props['position']>, default: 'fixed' },
		customClass: { type: String as PropType<Props['customClass']>, default: '' },
		noDefaultClass: { type: Boolean as PropType<Props['noDefaultClass']>, default: false },
		transitionName: { type: String as PropType<Props['transitionName']>, default: 'VueNotify' },
		options: { type: Object as PropType<Props['options']>, default: () => ({}) },
	},
	setup(props) {
		const { notifications, incoming } = useReceiver(props.key);
		const isHovering = ref(false);

		watch(incoming, (newOptions) => {
			let userProps: Record<string, any> = {};
			let component: Raw<Component> | undefined = undefined;
			let renderFn = undefined;

			const newData = mergeOptions(newOptions.type, props.options, newOptions);
			const createdAt = performance.now();

			if (
				notifications.value.length >= props.limit &&
				notifications.value[notifications.value.length - 1].type !== Status.PROMISE
			) {
				notifications.value[props.method === 'unshift' ? 'pop' : 'shift']();
			}

			if (![Status.PROMISE_RESOLVE, Status.PROMISE_REJECT].includes(newData.type)) {
				if (newData.render?.component) {
					userProps = newData.render?.props?.(getNotifyProps(newData)) ?? {};
					component = newData.render.component;

					renderFn = () => h(component as Raw<Component>, { ...userProps, key: newData.id });
				}

				notifications.value[props.method]({
					...newData,
					timeoutId:
						newData.type === Status.PROMISE
							? undefined
							: createTimeout(newData.id, newData.duration),
					stoppedAt: 0,
					elapsed: 0,
					clear: () => clear(newData.id),
					createdAt,
					renderFn,
					userProps,
					component,
				});
			} else {
				const currIndex = notifications.value.findIndex((data) => data.id === newData.id);
				const prevComponent = notifications.value[currIndex]?.component;

				if (prevComponent) {
					const nextProps = {
						...getNotifyProps(newData),
						...getPrevProps(notifications.value[currIndex].userProps),
					};

					userProps = newData.render?.props?.(nextProps) ?? {};
					component = newData.render?.component ?? prevComponent;

					renderFn = () => h(component as Raw<Component>, { ...userProps, key: newData.id });
				}

				notifications.value[currIndex] = {
					...notifications.value[currIndex],
					type: newData.type.split('-')[1],
					timeoutId: isHovering.value ? undefined : createTimeout(newData.id, newData.duration),
					createdAt,
					renderFn,
					userProps,
				};
			}
		});

		watch(
			() => notifications.value.length === 0,
			(newLen) => newLen && (isHovering.value = false)
		);

		function getNotifyProps({ title, message, type, id }: UserOptionsWithDefaults) {
			return { notifyProps: { title, message, type, close: () => clear(id) } };
		}

		function getPrevProps(userProps: Record<string, any>) {
			const { title, message, type, close, ...prevProps } = userProps;
			return { prevProps };
		}

		function createTimeout(id: string, time: number) {
			return setTimeout(() => {
				clear(id);
			}, time);
		}

		function clear(id: string) {
			notifications.value = notifications.value.filter((data) => data.id !== id);
		}

		function getPointerEvents() {
			if (props.pauseOnHover) {
				return {
					onMouseenter() {
						if (notifications.value.length > 0 && !isHovering.value) {
							isHovering.value = true;

							const stoppedAt = performance.now();

							notifications.value = notifications.value.map((prevData) => {
								if (prevData.timeoutId) {
									clearTimeout(prevData.timeoutId);
								}

								return {
									...prevData,
									stoppedAt,
									elapsed: stoppedAt - prevData.createdAt + prevData.elapsed,
								};
							});
						}
					},
					onMouseleave() {
						if (notifications.value.length > 0 && isHovering.value) {
							notifications.value = notifications.value.map((prevData) => {
								const newTimeout = 3000 + FIXED_INCREMENT - prevData.elapsed;

								return {
									...prevData,
									createdAt: performance.now(),
									timeoutId:
										prevData.type !== Status.PROMISE
											? createTimeout(prevData.id, newTimeout)
											: undefined,
								};
							});

							isHovering.value = false;
						}
					},
				};
			}
			return {};
		}

		return () =>
			h(Transition, { name: 'main' }, () => [
				notifications.value.length > 0 &&
					h('div', { class: 'VueNotify__root' }, [
						h(
							TransitionGroup,
							{
								name: 'list',
								tag: 'div',
								class: 'VueNotify__container',
								style: { '--VueNotifyTxDuration': '300ms', '--VueNotifyDxDuration': '300ms' },
								...getPointerEvents(),
							},
							() => notifications.value.map((data) => data.renderFn?.() ?? defaultRenderer(data))
						),
					]),
			]);
	},
});

// use () => [] instead of expressions
// https://stackoverflow.com/questions/69875273/non-function-value-encountered-for-default-slot-in-vue-3-composition-api-comp
