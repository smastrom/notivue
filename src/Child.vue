<script setup lang="ts">
import { inject } from 'vue';

type NotifyInjection = {
	push: Push;
	clearAll: () => void;
	destroyAll: () => void;
};

interface Push {
	(message: string): ClearMethod;
	error: (message: string) => ClearMethod;
	generic: (message: string) => ClearMethod;
	load: (message: string) => LoadMethods;
}

type ClearMethod = { clear: (id: string) => void };

type LoadMethods = {
	success: (message: string) => void;
	error: (message: string) => void;
} & ClearMethod;

function useNotify(key: string = 'vueNotify'): NotifyInjection {
	const { push, clearAll, destroyAll } = inject(key) as NotifyInjection;

	return { push, clearAll, destroyAll };
}

const { push, clearAll, destroyAll } = useNotify();

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

async function asyncPush() {
	const ayncNotify = push.load("We're sending your message. This will take a moment or two...");
	await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 6000)));

	if (Math.random() > 0.5) {
		ayncNotify.error('Promise rejected!');
	} else {
		ayncNotify.success('Promise successfully resolved!');
	}
}
</script>

<template>
	<div>
		<VueNotify />
		<button @click="push('Your message has been successfully sent. Please.')">Create</button>
		<button @click="push.error('Your message has not been successfully sent. Please.')">
			Error
		</button>
		<button @click="push.generic('This is a custom message, could be an info.')">Custom</button>
		<button @click="asyncPush">Load</button>
		<button @click="clearAll">Clear All</button>
		<button @click="destroyAll">Destroy All</button>
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
