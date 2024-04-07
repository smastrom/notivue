<script setup lang="ts">
import { useNotivue, type NotivueItem } from 'notivue'

import { Classes as Cx } from './constants'

const { isStreamPaused } = useNotivue()

defineProps<{
   item: NotivueItem
}>()
</script>

<template>
   <div
      v-if="Number.isFinite(item.duration)"
      :key="item.duplicateCount"
      :class="Cx.PROGRESS"
      :style="{
         animationPlayState: isStreamPaused ? 'paused' : 'running',
         '--nv-anim-dur': `${item.duration}ms`,
      }"
   />
</template>
