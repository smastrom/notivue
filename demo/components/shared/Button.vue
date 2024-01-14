<script setup lang="ts">
const props = defineProps<{
   text: string
}>()

const emit = defineEmits<{
   (event: 'click'): void
}>()
</script>

<template>
   <button @click="emit('click')" class="ButtonBase" role="button">
      <slot />
      <span>{{ props.text }}</span>
   </button>
</template>

<style scoped>
:slotted(svg) {
   width: 1em;
}
</style>
