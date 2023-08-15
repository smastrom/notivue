<script setup lang="ts">
import { getAriaLabel as getAriaLiveContent } from './utils'

import type { NotivueItem } from 'notivue'
import type { CSSProperties } from 'vue'

const props = defineProps<{
   item: NotivueItem
}>()

const visuallyHidden: CSSProperties = {
   position: 'absolute',
   width: '1px',
   height: '1px',
   padding: '0',
   margin: '-1px',
   overflow: 'hidden',
   clip: 'rect(0, 0, 0, 0)',
   whiteSpace: 'nowrap',
   border: '0',
}
</script>

<template>
   <div
      :style="visuallyHidden"
      :role="props.item.ariaRole"
      :aria-live="props.item.ariaLive"
      :key="`${item.id}_${item.type}`"
   >
      {{ getAriaLiveContent(props.item) }}
   </div>
</template>
