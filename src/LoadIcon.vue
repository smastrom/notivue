<template>
	<svg
		width="24"
		height="24"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g class="VueNotify_Spinner">
			<circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle>
		</g>
	</svg>
</template>

<style scoped>
.VueNotify_Spinner {
	transform-origin: center;
	animation: VueNotify_SpinnerOut 2s linear infinite;
}

.VueNotify_Spinner circle {
	stroke-linecap: round;
	animation: VueNotify_SpinnerIn 1.5s ease-in-out infinite;
}

@keyframes VueNotify_SpinnerOut {
	100% {
		transform: rotate(360deg);
	}
}

@keyframes VueNotify_SpinnerIn {
	0% {
		stroke-dasharray: 0 150;
		stroke-dashoffset: 0;
	}
	47.5% {
		stroke-dasharray: 42 150;
		stroke-dashoffset: -16;
	}
	95%,
	100% {
		stroke-dasharray: 42 150;
		stroke-dashoffset: -59;
	}
}
</style>
