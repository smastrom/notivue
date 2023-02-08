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
	<div>
		<button @click="push({ message: 'Your message has been successfully sent. Please.' })">
			Success
		</button>
		<button
			@click="push({ type: 'error', message: 'Your message has been successfully sent. Please.' })"
		>
			Error
		</button>
		<button @click="asyncPush">Promise</button>
		<button @click="customPush">Custom</button>
		<button @click="customAsync">Custom Promise</button>
		<button @click="push.clearAll()">Clear All</button>
	</div>
</template>

<style scoped>
div {
	display: grid;
	gap: 20px;
	grid-auto-flow: column;
	bottom: 0;
	white-space: nowrap;
	left: 0;
	padding: 30px;
	position: fixed;
}
</style>
