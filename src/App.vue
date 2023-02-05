<script setup lang="ts">
import { ref, provide, watch, h } from 'vue';

import Child from './Child.vue';
import ErrorIcon from './ErrorIcon.vue';
import InfoIcon from './InfoIcon.vue';
import LoadIcon from './LoadIcon.vue';
import SuccessIcon from './SuccessIcon.vue';

type NotifyType = 'SUCCESS' | 'ERROR' | 'GENERIC' | 'LOAD' | 'LOAD:SUCCESS' | 'LOAD:ERROR' | 'VOID';

type Notification = {
	id: string;
	type: NotifyType;
	message: string;
	createdAt: number;
	elapsed: number;
	stoppedAt: number;
	timeoutId: number | undefined;
	dxDuration: number;
	clear: () => void;
};

const icons = {
	error: ErrorIcon,
};

type IncomingData = { id: string; type: NotifyType; message: string };

const DEFAULT_TIMEOUT = 3000;
const FIXED_INCREMENT = 200;

const props = withDefaults(
	defineProps<{ method: 'unshift' | 'push'; limit: number; key: string; pauseOnHover: boolean }>(),
	{
		method: 'unshift',
		limit: 10,
		key: 'vueNotify',
		pauseOnHover: true,
	}
);

const incomingData = ref<IncomingData>({
	id: '',
	type: 'VOID',
	message: '',
});

const notifyArr = ref<Notification[]>([]);
const isHovering = ref(false);

const createID = () => crypto.randomUUID();

function push(message: string) {
	const id = createID();
	incomingData.value = { type: 'SUCCESS', message, id };

	return { clear: clear(id), destroy: () => destroy(id) };
}

push.error = (message: string) => {
	const id = createID();
	incomingData.value = { type: 'ERROR', message, id };

	return { clear: clear(id) };
};

push.generic = (message: string) => {
	const id = createID();
	incomingData.value = { type: 'GENERIC', message, id };

	return { clear: clear(id) };
};

push.load = (message: string) => {
	const id = createID();
	incomingData.value = { type: 'LOAD', message, id };

	return {
		clear: clear(id),
		success: (newMessage: string) => {
			incomingData.value = {
				id,
				type: 'LOAD:SUCCESS',
				message: newMessage,
			};
		},
		error: (newMessage: string) => {
			incomingData.value = {
				id,
				type: 'LOAD:ERROR',
				message: newMessage,
			};
		},
	};
};

const basicTypes: NotifyType[] = ['SUCCESS', 'ERROR', 'GENERIC'];
const loadTypes: NotifyType[] = ['LOAD:SUCCESS', 'LOAD:ERROR'];

const isStatic = (type: NotifyType) => basicTypes.includes(type);
const isLoading = (type: NotifyType) => type === 'LOAD';
const isPromiseResult = (type: NotifyType) => loadTypes.includes(type);

watch(incomingData, (newData) => {
	const message = newData.message;
	const createdAt = performance.now();

	if (isPromiseResult(newData.type)) {
		const loadIndex = notifyArr.value.findIndex((data) => data.id === newData.id);

		return (notifyArr.value[loadIndex] = {
			...notifyArr.value[loadIndex],
			type: newData.type.split(':')[1] as NotifyType,
			timeoutId: isHovering.value ? undefined : createTimeout(newData.id),
			message,
			createdAt,
		});
	}

	if (isStatic(newData.type)) {
		if (
			notifyArr.value.length === props.limit &&
			!isLoading(notifyArr.value[notifyArr.value.length - 1].type)
		) {
			notifyArr.value[props.method === 'unshift' ? 'pop' : 'shift']();
		}
	}

	notifyArr.value[props.method]({
		id: newData.id,
		type: newData.type,
		timeoutId: isLoading(newData.type) ? undefined : createTimeout(newData.id),
		elapsed: 0,
		dxDuration: 300,
		clear: () => clear(newData.id),
		message,
		stoppedAt: 0,
		createdAt,
	});
});

function onMouseEnter() {
	if (notifyArr.value.length > 1 && !isHovering.value) {
		isHovering.value = true;

		const stoppedAt = performance.now();

		notifyArr.value = notifyArr.value.map((prevData) => {
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
}

function onMouseLeave() {
	if (notifyArr.value.length > 1 && isHovering.value) {
		notifyArr.value = notifyArr.value.map((prevData) => {
			const newTimeout = DEFAULT_TIMEOUT + FIXED_INCREMENT - prevData.elapsed;

			return {
				...prevData,
				createdAt: performance.now(),
				timeoutId: isStatic(prevData.type) ? createTimeout(prevData.id, newTimeout) : undefined,
			};
		});

		isHovering.value = false;
	}
}

function clear(id: string) {
	notifyArr.value = notifyArr.value.filter(({ id: prevId }) => prevId !== id);
}

function clearAll() {
	notifyArr.value = [];
}

function destroy(id: string) {}

function destroyAll() {}

provide(props.key, { push, clearAll, destroyAll });

function createTimeout(id: string, time = DEFAULT_TIMEOUT) {
	return setTimeout(() => {
		notifyArr.value = notifyArr.value.filter((data) => data.id !== id);
	}, time);
}
</script>

<template>
	<Transition name="main">
		<div class="VueNotify__root" v-if="notifyArr.length > 0" ref="rootRef">
			<TransitionGroup
				name="list"
				tag="div"
				@mouseenter="onMouseEnter"
				@mouseleave="onMouseLeave"
				class="VueNotify__container"
			>
				<!-- 				<IconRender :icons="icons" /> -->
				<div
					v-for="data in notifyArr"
					:key="data.id"
					class="Toast"
					:data-vuenotify="data.type.toLowerCase()"
					:style="{
						'--VueNotifyTxDuration': `400ms`,
						'--VueNotifyDxDuration': `${data.dxDuration}ms`,
					}"
				>
					<span aria-hidden="true" class="Toast__icon">
						<SuccessIcon v-if="data.type === 'SUCCESS'" />
						<ErrorIcon v-else-if="data.type === 'ERROR'" />
						<LoadIcon v-else-if="data.type === 'LOAD'" />
						<InfoIcon v-else-if="data.type === 'GENERIC'" />
					</span>

					<p class="Toast__message">{{ data.message }}</p>

					<div class="Toast__right">
						<button class="Toast__button" @click="data.clear">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
				</div>
			</TransitionGroup>
		</div>
	</Transition>
	<Child />
</template>

<style>
.main-enter-active {
	transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
		opacity 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.main-enter-from {
	opacity: 0;
	transform: scale(0.5) translate3d(0, -100px, 0);
}

.main-leave-active {
	transition: opacity 300ms ease;
}

.main-leave-to {
	opacity: 0;
}

.VueNotify__root {
	display: flex;
	position: fixed;
	justify-content: center;
	align-items: center;
	width: 100vw;
	top: 0;
	left: 0;
}

.VueNotify__container {
}

.Toast {
	background: #68ff004a;
	margin: 10px;
	padding: 10px;
	width: 300px;
	border-radius: 10px;
	display: grid;
	grid-template-columns: auto 1fr auto;
	border: 1px solid #75ff77;
	box-shadow: 0 0 3px #67ff0052;
	gap: 10px;
	justify-items: center;
	align-items: center;
}

[data-vuenotify='error'] {
	background: #ff00004a;
	border: 1px solid #ff0000;
	box-shadow: 0 0 3px #ff000052;
}

[data-vuenotify='load'] {
	background: #00ffff4a;
	border: 1px solid #00ffff;
	box-shadow: 0 0 3px #00ffff52;
}

[data-vuenotify='generic'] {
	background: #ffff004a;
	border: 1px solid #ffff00;
	box-shadow: 0 0 3px #ffff0052;
}

.Toast__icon svg {
	opacity: 0.75;
	display: flex;
}

.Toast__right {
	border-left: 1px solid #ffffff26;
}

.Toast__message {
	text-align: left;
	margin: 0;
	padding: 0;
	font-weight: 600;
	font-size: 0.925rem;
	line-height: 1.33em;
}

.Toast__button {
	border: none;
	background: none;
	padding: 10px;
	margin: 0;
	opacity: 0.5;
	margin-right: -10px;
}

.Toast__button svg {
	display: flex;
}

.Toast__button:hover {
	border: none;
	background: none;
	opacity: 1;
}

.list-move,
.list-enter-active {
	transition: transform var(--VueNotifyTxDuration) cubic-bezier(0.22, 1, 0.36, 1),
		opacity var(--VueNotifyTxDuration) cubic-bezier(0.22, 1, 0.36, 1);
}

.list-leave-active {
	position: absolute;
	transition: transform var(--VueNotifyDxDuration) cubic-bezier(0.22, 1, 0.36, 1),
		opacity var(--VueNotifyDxDuration) cubic-bezier(0.22, 1, 0.36, 1);
}

.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: scale(0.75) translate3d(0, -100px, 0);
}
</style>
