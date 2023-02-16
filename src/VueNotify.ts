import {
	computed,
	defineComponent,
	h,
	ref,
	Teleport,
	toRef,
	TransitionGroup,
	watch,
	type CSSProperties,
	type PropType,
} from 'vue';
import { useReceiver } from './useReceiver';
import { mergeOptions } from './utils';
import { FIXED_INCREMENT, Status } from './constants';
import { defaultRenderer } from './defaultRenderer';
import type { ComponentProps as Props, UserOptionsWithInternals, Notification } from './types';

export const VueNotify = defineComponent({
	name: 'VueNotify',
	inheritAttrs: false,
	props: {
		key: { type: String as PropType<Props['key']>, default: '' },
		method: { type: String as PropType<Props['method']>, default: 'unshift' },
		limit: { type: Number as PropType<Props['limit']>, default: 10 },
		pauseOnHover: { type: Boolean as PropType<Props['pauseOnHover']>, default: true },
		customClass: { type: String as PropType<Props['customClass']>, default: '' },
		noDefaultClass: { type: Boolean as PropType<Props['noDefaultClass']>, default: false },
		margin: { type: Object as PropType<Props['margin']>, default: () => ({ y: 30, x: 30 }) },
		maxWidth: { type: Number as PropType<Props['maxWidth']>, default: 1280 },
		placement: { type: String as PropType<Props['placement']>, default: 'bottom-right' },
		options: { type: Object as PropType<Props['options']>, default: () => ({}) },
		transitionName: { type: String as PropType<Props['transitionName']>, default: 'VueNotify' },
	},
	setup(props: Props) {
		const { notifications, incoming } = useReceiver(props.key);

		const isHovering = ref(false);

		const placement = toRef(props, 'placement');
		const margin = toRef(props, 'margin');
		const maxWidth = toRef(props, 'maxWidth');

		// Watchers

		watch(incoming, (_options) => {
			let customH: Pick<Notification, 'userProps' | 'component' | 'renderFn'> = {
				userProps: {},
				component: undefined,
				renderFn: undefined,
			};

			const options = mergeOptions(_options.type, props.options, _options);
			const createdAt = performance.now();

			if (
				notifications.length >= props.limit &&
				notifications[notifications.length - 1].type !== Status.PROMISE
			) {
				notifications[props.method === 'unshift' ? 'pop' : 'shift']();
			}

			if ([Status.PROMISE_RESOLVE, Status.PROMISE_REJECT].includes(options.type)) {
				const currIndex = notifications.findIndex((data) => data.id === options.id);
				const prevComponent = notifications[currIndex]?.component;

				if (prevComponent) {
					const { title, message, type, close, ...prevProps } = notifications[currIndex].userProps;

					const nextProps = {
						...getNotifyProps(options),
						prevProps,
					};

					customH = {
						userProps: options.render?.props?.(nextProps) ?? {},
						component: options.render?.component ?? prevComponent,
						renderFn: () => h(customH.component ?? {}, { ...customH.userProps, key: options.id }),
					};
				}

				notifications[currIndex] = {
					...notifications[currIndex],
					...options,
					...customH,
					timeoutId: isHovering.value ? undefined : createTimeout(options.id, options.duration),
					createdAt,
				};
			} else {
				if (options.render?.component) {
					customH = {
						userProps: options.render?.props?.(getNotifyProps(options)) ?? {},
						component: options.render.component,
						renderFn: () => h(customH.component ?? {}, { ...customH.userProps, key: options.id }),
					};
				}

				notifications[props.method]({
					...options,
					...customH,
					timeoutId:
						options.type === Status.PROMISE
							? undefined
							: createTimeout(options.id, options.duration),
					clear: () => clear(options.id),
					createdAt,
				} as Notification);
			}
		});

		watch(
			() => notifications.length === 0,
			(newLen) => newLen && (isHovering.value = false)
		);

		// Methods

		function getNotifyProps({ title, message, type, id }: UserOptionsWithInternals) {
			return { notifyProps: { title, message, type, close: () => clear(id) } };
		}

		function createTimeout(id: string, time: number) {
			return setTimeout(() => {
				clear(id);
			}, time);
		}

		function clear(id: string) {
			const toRemove = notifications.findIndex((data) => data.id === id);
			notifications.splice(toRemove, 1);
		}

		// Props

		const rootStyles: CSSProperties = {
			pointerEvents: 'none',
			position: 'fixed',
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
		};

		const rootContStyles = computed<CSSProperties>(() => ({
			padding: `${margin.value.y}px ${margin.value.x}px`,
			width: `${maxWidth.value}px`,
			maxWidth: '100%',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			alignItems: placement.value.includes('top') ? 'flex-start' : 'flex-end',
			justifyContent: placement.value.includes('right')
				? 'flex-end'
				: placement.value.includes('left')
				? 'flex-start'
				: 'flex-center',
		}));

		const pointerEvts = {
			onPointerenter() {
				if (notifications.length > 0 && !isHovering.value) {
					isHovering.value = true;
					const stoppedAt = performance.now();

					notifications.forEach((prevData, currIndex) => {
						if (prevData.timeoutId) {
							clearTimeout(notifications[currIndex].timeoutId);
						}

						notifications[currIndex] = {
							...prevData,
							stoppedAt,
							elapsed: stoppedAt - prevData.createdAt + (prevData.elapsed ?? 0),
						};
					});
				}
			},
			onPointerleave() {
				if (notifications.length > 0 && isHovering.value) {
					notifications.forEach((prevData, currIndex) => {
						const newTimeout = prevData.duration + FIXED_INCREMENT - prevData.elapsed;

						notifications[currIndex] = {
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

		return () =>
			h(Teleport, { to: 'body' }, [
				h('div', { style: rootStyles }, [
					h('div', { style: rootContStyles.value, ...(props.pauseOnHover ? pointerEvts : {}) }, [
						h(TransitionGroup, { name: 'list' }, () =>
							notifications.map(
								(data) =>
									data.renderFn?.() ??
									defaultRenderer(data, props.noDefaultClass, props.customClass)
							)
						),
					]),
				]),
			]);
	},
});
