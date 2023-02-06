import {
	defineComponent,
	h,
	ref,
	Transition,
	TransitionGroup,
	watch,
	type PropType as PT,
} from 'vue';
import { useReceiver } from './useReceiver';
import { mergeOptions } from './utils';
import { FIXED_INCREMENT } from './constants';
import { featherProps, icons } from './icons';
import type { Props as P } from './types';

import './index.css';

const promiseTypes = ['promise', 'promise-resolve', 'promise-reject'];

const isBasic = (type: string) => !promiseTypes.includes(type);
const isPromise = (type: string) => type === 'promise';
const isPromiseResult = (type: string) => ['promise-resolve', 'promise-reject'].includes(type);

export const VueNotify = defineComponent({
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

		const isHovering = ref(false);

		function createTimeout(id: string, time: number) {
			return setTimeout(() => {
				clear(id);
			}, time);
		}

		function clear(id: string) {
			container.value = container.value.filter((data) => data.id !== id);
		}

		watch(incoming, (_newData) => {
			//
			const newData = mergeOptions(_newData.type, props.options, _newData);

			const createdAt = performance.now();

			if (newData.render?.component) {
				// Push default render function or custom
			}

			if (isPromiseResult(newData.type)) {
				const promiseIndex = container.value.findIndex((data) => data.id === newData.id);

				return (container.value[promiseIndex] = {
					...container.value[promiseIndex],
					type: newData.type.split('-')[1],
					timeoutId: isHovering.value ? undefined : createTimeout(newData.id, newData.duration),
					createdAt,
				});
			}

			if (
				container.value.length === props.limit &&
				!isPromise(container.value[container.value.length - 1].type)
			) {
				// If limit is reached, remove the last
				container.value[props.method === 'unshift' ? 'pop' : 'shift']();
			}

			container.value[props.method]({
				...newData,
				createdAt,
				timeoutId: isPromise(newData.type)
					? undefined
					: createTimeout(newData.id, newData.duration),
				stoppedAt: 0,
				elapsed: 0,
				clear: () => clear(newData.id),
			});
		});

		function getPointerEvents() {
			if (props.pauseOnHover) {
				return {
					onMouseenter() {
						if (container.value.length > 0 && !isHovering.value) {
							isHovering.value = true;

							const stoppedAt = performance.now();

							container.value = container.value.map((prevData) => {
								if (prevData.timeoutId) {
									clearTimeout(prevData.timeoutId);
								}

								return {
									...prevData,
									stoppedAt,
									elapsed:
										stoppedAt -
										prevData.createdAt +
										/* */ prevData.elapsed /*  <- Zero on first mouseEnter */,
								};
							});
						}
					},
					onMouseleave() {
						if (container.value.length > 0 && isHovering.value) {
							container.value = container.value.map((prevData) => {
								const newTimeout = 3000 + FIXED_INCREMENT - prevData.elapsed;

								return {
									...prevData,
									createdAt: performance.now(),
									timeoutId: isBasic(prevData.type)
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

		watch(
			() => container.value.length === 0,
			(newArr) => {
				if (newArr) {
					isHovering.value = false;
				}
			}
		);

		return () =>
			h(Transition, { name: 'main' }, () => [
				container.value.length > 0 &&
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
							() => [
								container.value.map((notification) =>
									h(
										'div',
										{
											class: 'Toast',
											key: notification.id,
											'data-vuenotify': notification.type,
										},
										[
											h('svg', { 'aria-hidden': true, ...featherProps, class: 'Toast__icon' }, [
												icons[notification.type] ?? icons.success,
											]),
											h('p', { class: 'Toast__message' }, notification.message),
											h('button', { class: 'Toast__button', onClick: notification.clear }, [
												h('svg', { 'aria-hidden': true, ...featherProps }, [icons.close]),
											]),
										]
									)
								),
							]
						),
					]),
			]);
	},
});

// use () => [] instead of expressions - https://stackoverflow.com/questions/69875273/non-function-value-encountered-for-default-slot-in-vue-3-composition-api-comp
