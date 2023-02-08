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
		customClass: { type: String as PropType<Props['customClass']>, default: '' }, // OK
		noDefaultClass: { type: Boolean as PropType<Props['noDefaultClass']>, default: false }, // OK
		options: { type: Object as PropType<Props['options']>, default: () => ({}) },
		placement: { type: String as PropType<Props['placement']>, default: 'top-right' },
		position: { type: String as PropType<Props['position']>, default: 'fixed' },
		transitionName: { type: String as PropType<Props['transitionName']>, default: 'VueNotify' },
	},
	setup(props) {
		const { notifications, incoming } = useReceiver(props.key);
		const isHovering = ref(false);

		watch(incoming, (_options) => {
			let userProps = {};
			let component: Raw<Component> | undefined = undefined;
			let renderFn;

			const options = mergeOptions(_options.type, props.options, _options);
			const createdAt = performance.now();

			if (
				notifications.value.length >= props.limit &&
				notifications.value[notifications.value.length - 1].type !== Status.PROMISE
			) {
				notifications.value[props.method === 'unshift' ? 'pop' : 'shift']();
			}

			if ([Status.PROMISE_RESOLVE, Status.PROMISE_REJECT].includes(options.type)) {
				const currIndex = notifications.value.findIndex((data) => data.id === options.id);
				const prevComponent = notifications.value[currIndex]?.component;

				if (prevComponent) {
					const { title, message, type, close, ...prevProps } =
						notifications.value[currIndex].userProps;

					const nextProps = {
						...getNotifyProps(options),
						prevProps,
					};

					userProps = options.render?.props?.(nextProps) ?? {};
					component = options.render?.component ?? prevComponent;
					renderFn = () => h(component as Raw<Component>, { ...userProps, key: options.id });
				}

				notifications.value[currIndex] = {
					...notifications.value[currIndex],
					...options,
					timeoutId: isHovering.value ? undefined : createTimeout(options.id, options.duration),
					createdAt,
					renderFn,
					userProps,
				};
			} else {
				if (options.render?.component) {
					userProps = options.render?.props?.(getNotifyProps(options)) ?? {};
					component = options.render.component;
					renderFn = () => h(component as Raw<Component>, { ...userProps, key: options.id });
				}

				notifications.value[props.method]({
					...options,
					timeoutId:
						options.type === Status.PROMISE
							? undefined
							: createTimeout(options.id, options.duration),
					stoppedAt: 0,
					elapsed: 0,
					clear: () => _clear(options.id),
					createdAt,
					renderFn,
					userProps,
					component,
				});
			}
		});

		watch(
			() => notifications.value.length === 0,
			(newLen) => newLen && (isHovering.value = false)
		);

		function getNotifyProps({ title, message, type, id }: UserOptionsWithDefaults) {
			return { notifyProps: { title, message, type, close: () => _clear(id) } };
		}

		function createTimeout(id: string, time: number) {
			return setTimeout(() => {
				_clear(id);
			}, time);
		}

		function _clear(id: string) {
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
								const newTimeout = prevData.duration + FIXED_INCREMENT - prevData.elapsed;

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
			h(
				Transition,
				{ name: 'main' },
				() =>
					notifications.value.length > 0 &&
					h('div', { class: 'VueNotify__root' }, [
						h(
							TransitionGroup,
							{
								name: 'list',
								tag: 'div',
								class: 'VueNotify__list',
								style: { '--VueNotifyTxDuration': '300ms', '--VueNotifyDxDuration': '300ms' },
								...getPointerEvents(),
							},
							() =>
								notifications.value.map(
									(data) =>
										data.renderFn?.() ??
										defaultRenderer(data, props.noDefaultClass, props.customClass)
								)
						),
					])
			);
	},
});
