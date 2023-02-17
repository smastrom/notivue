import {
	defineComponent,
	h,
	Teleport,
	toRef,
	Transition,
	TransitionGroup,
	watch,
	type PropType,
} from 'vue';
import { useReceiver } from './useReceiver';
import { useReceiverStyles } from './useReceiverStyles';
import { getOrigin, mergeOptions } from './utils';
import { Type, FIXED_INCREMENT } from './constants';
import { defaultComponent } from './defaultComponent';
import { defaultOptions } from './defaultOptions';
import { ariaLive } from './ariaLive';
import type { ComponentProps as Props, MergedOptions, Notification } from './types';

export const Receiver = defineComponent({
	name: 'VueNotify',
	inheritAttrs: false,
	props: {
		id: {
			type: String as PropType<Props['id']>,
			default: '',
		},
		method: {
			type: String as PropType<Props['method']>,
			default: 'unshift',
		},
		limit: {
			type: Number as PropType<Props['limit']>,
			default: 10,
		},
		pauseOnHover: {
			type: Boolean as PropType<Props['pauseOnHover']>,
			default: true,
		},
		disabled: {
			type: Boolean as PropType<Props['disabled']>,
			default: false,
		},
		rootMargin: {
			type: Object as PropType<Props['rootMargin']>,
			default: () => ({ y: 30, x: 30 }),
		},
		maxWidth: {
			type: Number as PropType<Props['maxWidth']>,
			default: 0,
		},
		position: {
			type: String as PropType<Props['position']>,
			default: 'top-center',
		},
		transitionName: {
			type: String as PropType<Props['transitionName']>,
			default: 'VNRoot',
		},
		transitionGroupName: {
			type: String as PropType<Props['transitionGroupName']>,
			default: 'VNList',
		},
		options: {
			type: Object as PropType<Props['options']>,
			default: () => defaultOptions,
		},
		closeAriaLabel: {
			type: String as PropType<Props['closeAriaLabel']>,
			default: 'Close',
		},
	},
	setup(props) {
		let isHovering = false;

		// Reactivity

		const position = toRef(props, 'position');
		const rootMargin = toRef(props, 'rootMargin');
		const maxWidth = toRef(props, 'maxWidth');
		const disabled = toRef(props, 'disabled');

		const { items, incoming } = useReceiver(props.id);
		const { wrapperStyles, containerStyles, hoverAreaStyles } = useReceiverStyles({
			rootMargin,
			maxWidth,
			position,
		});

		// Watchers

		let unsubscribe = subscribe();

		watch(disabled, (isDisabled) => {
			if (isDisabled) {
				items.length = 0;
				unsubscribe();
			} else {
				unsubscribe = subscribe();
			}
		});

		watch(
			() => items.length === 0,
			(newLen) => newLen && (isHovering = false),
			{ flush: 'post' }
		);

		// Functions

		function subscribe() {
			return watch(incoming, (_options) => {
				const isUnshift = props.method === 'unshift';

				if (
					items.length >= props.limit &&
					items[isUnshift ? items.length - 1 : 0].type !== Type.PROMISE
				) {
					items[isUnshift ? 'pop' : 'shift']();
				}

				let customRender: Pick<Notification, 'userProps' | 'component' | 'renderFn'> = {
					component: undefined,
					userProps: {},
					renderFn: undefined,
				};

				const options = mergeOptions(props.options, _options);
				const createdAt = performance.now();

				if (
					options.type.includes(Type.PROMISE_REJECT) ||
					options.type.includes(Type.PROMISE_RESOLVE)
				) {
					const currIndex = items.findIndex((data) => data.id === options.id);
					const prevComponent = items[currIndex]?.component;

					if (prevComponent) {
						const { title, message, type, close, ...prevProps } = items[currIndex].userProps;
						const nextProps = { ...getNotifyProps(options), prevProps };

						customRender = {
							userProps: options.render?.props?.(nextProps) ?? {},
							component: options.render?.component ?? prevComponent,
							renderFn: () =>
								h(customRender.component ?? {}, {
									...customRender.userProps,
									key: options.id,
								}),
						};
					}

					items[currIndex] = {
						...items[currIndex],
						...options,
						...customRender,
						timeoutId: isHovering ? undefined : createTimeout(options.id, options.duration),
						createdAt,
					};
				} else {
					if (options.render?.component) {
						customRender = {
							userProps: options.render?.props?.(getNotifyProps(options)) ?? {},
							component: options.render.component,
							renderFn: () =>
								h(customRender.component ?? {}, {
									...customRender.userProps,
									key: options.id,
								}),
						};
					}

					items[props.method]({
						...options,
						...customRender,
						timeoutId:
							options.type === Type.PROMISE
								? undefined
								: createTimeout(options.id, options.duration),
						clear: () => clear(options.id),
						createdAt,
					} as Notification);
				}
			});
		}

		function createTimeout(id: string, time: number) {
			return setTimeout(() => {
				items.find((data) => data.id === id)?.clear();
			}, time);
		}

		function clear(id: string) {
			const index = items.findIndex((data) => data.id === id);
			items.splice(index, 1);
		}

		function getNotifyProps({ title, message, type, id }: MergedOptions) {
			return { notifyProps: { title, message, type, close: () => clear(id) } };
		}

		// Props

		const pointerEvts = {
			onPointerenter() {
				if (items.length > 0 && !isHovering) {
					isHovering = true;

					const stoppedAt = performance.now();

					items.forEach((prevData, currIndex) => {
						clearTimeout(items[currIndex].timeoutId);

						items[currIndex] = {
							...prevData,
							stoppedAt,
							elapsed: stoppedAt - prevData.createdAt + (prevData.elapsed ?? 0),
						};
					});
				}
			},
			onPointerleave() {
				if (items.length > 0 && isHovering) {
					items.forEach((prevData, currIndex) => {
						const newTimeout = prevData.duration + FIXED_INCREMENT - prevData.elapsed;

						items[currIndex] = {
							...prevData,
							createdAt: performance.now(),
							timeoutId:
								prevData.type !== Type.PROMISE ? createTimeout(prevData.id, newTimeout) : undefined,
						};
					});

					isHovering = false;
				}
			},
		};

		return () =>
			h(Teleport, { to: 'body' }, [
				h(
					Transition,
					{
						name: props.transitionName,
						onEnter(el) {
							(el as HTMLElement).style.transformOrigin = getOrigin(el as HTMLElement, position);
						},
					},
					() =>
						items.length > 0 && [
							h('div', { style: wrapperStyles }, [
								h('div', { style: containerStyles.value }, [
									h(
										'div',
										{
											style: hoverAreaStyles,
											...(props.pauseOnHover ? pointerEvts : {}),
											...(props.id ? { 'data-vuenotify': props.id } : {}),
										},
										[
											h(TransitionGroup, { name: props.transitionGroupName }, () =>
												items.map((item) => [
													h('div', { key: item.id }, [
														item.renderFn?.() ?? defaultComponent(item),
														ariaLive(item),
													]),
												])
											),
										]
									),
								]),
							]),
						]
				),
			]);
	},
});
