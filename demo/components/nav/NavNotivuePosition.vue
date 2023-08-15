<script setup lang="ts">
import { useNotivue, type Position } from 'notivue'

import ArrowIcon from '../icons/ArrowIcon.vue'

const { state, actions } = useStore()

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

const isFullWidth = computed(() => state.maxWidth === '100%')

const config = useNotivue()

function setPosition(position: Position) {
   config.position.value = position
}
</script>

<template>
   <div role="radiogroup" aria-label="Position">
      <div
         class="ButtonBase SwitchButton SquaredSwitch"
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

      <button
         class="ButtonBase SwitchButton Switch"
         role="switch"
         :aria-checked="isFullWidth"
         aria-label="Full Width"
         @click="actions.setFullWidth"
      >
         Full Width
      </button>
      <button
         class="ButtonBase SwitchButton Switch"
         role="switch"
         :aria-checked="state.centerOnMobile"
         aria-label="Center on Mobile"
         @click="actions.toggleCenterOnMobile"
      >
         Center on Mobile
      </button>
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
   padding: 0px;
   width: 2rem;
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
