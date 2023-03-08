<script setup lang="ts">
import { computed } from 'vue'
import { store, setPosition, setFullWidth } from './store'
import Arrow from './icons/Arrow.vue'
import type { Position } from '../src/types'

const isFullWidth = computed(() => store.maxWidth === '100%')

const positions = [
   {
      value: 'topLeft',
      label: 'Top Left',
      rotate: 0,
   },
   {
      value: 'topCenter',
      label: 'Top Center',
      rotate: 45,
   },
   {
      value: 'topRight',
      label: 'Top Right',
      rotate: 90,
   },
   {
      value: 'bottomLeft',
      label: 'Bottom Left',
      rotate: -90,
   },
   {
      value: 'bottomCenter',
      label: 'Bottom Center',
      rotate: -135,
   },
   {
      value: 'bottomRight',
      label: 'Bottom Right',
      rotate: -180,
   },
]
</script>

<template>
   <div role="radiogroup" aria-label="Position">
      <div
         class="ButtonBase"
         v-for="position in positions"
         :key="position.label"
         role="radio"
         @click="setPosition(position.value as Position)"
         tabindex="0"
         :aria-label="position.label"
         :aria-checked="store.position === position.value"
      >
         <Arrow :rotate="position.rotate" />
      </div>

      <div
         class="ButtonBase Switch"
         role="switch"
         :aria-checked="isFullWidth"
         aria-label="Full Width"
         @click="setFullWidth"
      >
         Full Width
      </div>
      <div
         class="ButtonBase Switch"
         role="switch"
         :aria-checked="isFullWidth"
         aria-label="Full Width"
         @click="setFullWidth"
      >
         Center on Mobile
      </div>
   </div>
</template>

<style scoped>
div[role='radiogroup'] {
   display: grid;
   grid-template-columns: 1fr 1fr 1fr;
   grid-template-rows: 1fr 1fr;
   height: max-content;
   gap: 10px;
}

div[role='radio'] {
   &[aria-checked='true'] {
      background-color: #6b7a90;
      color: white;
      aspect-ratio: 1;
   }
}

.Switch {
   font-weight: 700;
   font-size: 0.925rem;
   justify-items: center;
   display: grid;
   grid-column: 1 / span 3;
   aspect-ratio: unset !important;
   height: max-content;

   &[aria-checked='true'] {
      background-color: #6b7a90;
      color: white;
   }
}

svg {
   width: 1em;
}
</style>
