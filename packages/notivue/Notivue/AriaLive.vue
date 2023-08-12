<script setup lang="ts">
import { getAriaLabel as getAriaLiveContent } from './utils'
import { NotivueSlot } from 'notivue'

const props = defineProps<{
   item: NotivueSlot
}>()
</script>

<template>
   <div
      aria-atomic="true"
      :role="props.item.ariaRole"
      :aria-live="props.item.ariaLive"
      :key="`${item.id}_${item.type}`"
   >
      {{ getAriaLiveContent(props.item) }}
   </div>
</template>
