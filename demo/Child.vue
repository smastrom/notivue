<script setup lang="ts">
import { markRaw } from 'vue';
import { useNotify } from '../src/useNotify';
import Custom from './Custom.vue';

const push = useNotify();

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

async function asyncPush() {
	const ayncNotify = push.promise({
		message: "We're sending your message. This will take a moment or two...",
	});

	await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)));

	if (Math.random() > 0.5) {
		ayncNotify.reject({ message: 'Promise rejected!' });
	} else {
		ayncNotify.resolve({ message: 'Promise successfully resolved!' });
	}
}

function customPush() {
	push({
		message: 'Custom',
		render: {
			component: markRaw(Custom),
			props: ({ notifyProps }) => ({
				...notifyProps,
				avatarUrl: 'https://i.pravatar.cc/150?img=1',
			}),
		},
	});
}

async function customAsync() {
	const promise = push.promise({
		message: 'Async',
		render: {
			component: markRaw(Custom),
			props: ({ notifyProps }) => ({
				...notifyProps,
				avatarUrl: 'https://i.pravatar.cc/150?img=1',
			}),
		},
	});

	await new Promise((resolve) => setTimeout(resolve, 3000));

	promise.resolve({
		message: 'Async resolved',
		render: {
			component: markRaw(Custom),
			props: ({ notifyProps, prevProps }) => ({
				...notifyProps,
				...prevProps,
				name: 'Rubrante',
			}),
		},
	});
}
</script>

<template>
	<nav>
		<button @click="push({ message: 'Your message has been successfully sent. Please.' })">
			Success
		</button>
		<button @click="push.error({ message: 'Your message has been successfully sent. Please.' })">
			Error
		</button>
		<button @click="push.info({ message: 'Your message has been successfully sent. Please.' })">
			Info
		</button>
		<button @click="push.warning({ message: 'Your message has been successfully sent. Please.' })">
			Warning
		</button>
		<button @click="asyncPush">Promise</button>
		<button @click="customPush">Custom</button>
		<button @click="customAsync">Custom Promise</button>
		<button @click="push.clearAll()">Clear All</button>
	</nav>
</template>

<style scoped>
nav {
	display: flex;
	width: 100%;
	gap: 20px;
	justify-content: center;
	z-index: 9999999;
	bottom: 0;
	left: 0;
	padding: 30px;
	flex-wrap: wrap;
	position: fixed;
	gap: 20px;
}

nav button {
	width: max-content;
	white-space: nowrap;
}
</style>
