<script setup lang="ts">
import { computed } from 'vue'
import { useNotivue, type Position } from 'notivue'

import { store, setFullWidth, toggleCenterOnMobile } from '@/lib/store'

import ArrowIcon from '../icons/ArrowIcon.vue'

const positions = [
   {
      value: 'top-left',
      label: 'Top Left',
      rotate: 0,
   },
   {
      value: 'top-center',
      label: 'Top Center',
      rotate: 45,
   },
   {
      value: 'top-right',
      label: 'Top Right',
      rotate: 90,
   },
   {
      value: 'bottom-left',
      label: 'Bottom Left',
      rotate: -90,
   },
   {
      value: 'bottom-center',
      label: 'Bottom Center',
      rotate: -135,
   },
   {
      value: 'bottom-right',
      label: 'Bottom Right',
      rotate: -180,
   },
]

const isFullWidth = computed(() => store.maxWidth === '100%')

const config = useNotivue()

function setPosition(position: Position) {
   config.position.value = position
}
</script>

<template>
   <div role="radiogroup" aria-label="Position">
      <div
         class="ButtonBase SwitchButton"
         v-for="position in positions"
         :key="position.label"
         role="radio"
         @click="setPosition(position.value as Position)"
         tabindex="0"
         :aria-label="position.label"
         :aria-checked="config.position.value === position.value"
      >
         <ArrowIcon :rotate="position.rotate" />
      </div>

      <div
         class="ButtonBase SwitchButton Switch"
         role="switch"
         :aria-checked="isFullWidth"
         aria-label="Full Width"
         @click="setFullWidth"
      >
         Full Width
      </div>
      <div
         class="ButtonBase SwitchButton Switch"
         role="switch"
         :aria-checked="store.centerOnMobile"
         aria-label="Center on Mobile"
         @click="toggleCenterOnMobile"
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
   aspect-ratio: 1;
}

.Switch {
   font-weight: 700;
   font-size: 0.925rem;
   justify-items: center;
   display: grid;
   grid-column: 1 / span 3;
   aspect-ratio: unset !important;
   height: max-content;
}

svg {
   width: 1em;
}
</style>
../../src/types/types
