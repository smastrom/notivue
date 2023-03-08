<script setup lang="ts">
const props = defineProps<{
   rotate: number
}>()
</script>

<template>
   <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18.993 18.993"
      :style="{
         transform: `rotate(${rotate}deg)`,
      }"
   >
      <path
         d="M105.288,122.576,100,117.288,105.288,112m-4.553,5.288h10.722"
         :transform="`translate(17.67 -148.2) rotate(45)`"
         fill="none"
         stroke="currentColor"
         stroke-linecap="round"
         stroke-linejoin="round"
         stroke-width="2"
      />
   </svg>
</template>
