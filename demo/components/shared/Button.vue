<script setup lang="ts">
const props = defineProps<{
   text: string
   isDisabled?: boolean
}>()

const emit = defineEmits<{
   (event: 'click'): void
}>()
</script>

<template>
   <button @click="emit('click')" class="ButtonBase" role="button" :disabled="isDisabled">
      <slot />
      <span>{{ props.text }}</span>
   </button>
</template>

<style scoped>
:slotted(svg) {
   width: 1em;
}
</style>
