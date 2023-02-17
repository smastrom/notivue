<script setup lang="ts">
defineProps<{
	message?: string;
	title?: string | boolean;
	type?: string;
	close: () => void;
	avatarUrl?: string;
	name?: string;
}>();
</script>

<template>
	<div class="Container">
		<p>{{ message }}</p>
		<button @click="close">Dismiss</button>
		<div v-if="avatarUrl">
			<img :src="avatarUrl" />
		</div>
		<div v-if="name">
			<p>{{ name }}</p>
		</div>
	</div>
</template>

<style scoped>
.Container {
	padding: 10px;
	width: 300px;
	color: black;
	background-color: white;
	border-radius: 5px;
	display: grid;
	grid-template-columns: auto 100px;
	margin: 10px auto;

	& > p {
		margin: 0 !important;
		padding: 0 !important;
	}
}
</style>
