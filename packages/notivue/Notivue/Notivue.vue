<script setup lang="ts">
import { Teleport, type Component } from 'vue'

import { useConfig, useItems, useElements } from '@/core/useStore'

import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles, visuallyHidden } from './composables/useNotivueStyles'
import { useRepositioning } from './composables/useRepositioning'
import { useVisibilityChange } from './composables/useVisibilityChange'
import { getSlotContext } from './utils'

import { NotivueSlot } from '@/types'

defineProps<{
   class?: string
}>()

defineSlots<{
   default(item: NotivueSlot): Component
}>()

const config = useConfig()
const items = useItems()
const elements = useElements()

const styles = useNotivueStyles()

const mouseEvents = useMouseEvents()
const touchEvents = useTouchEvents()

useVisibilityChange({
   onHidden: () => (config.pauseOnTabChange.value ? items.pauseTimeouts() : items.removeAll()),
   onVisible: () => (config.pauseOnTabChange.value ? items.resumeTimeouts() : {}),
})

useRepositioning()
</script>

<template>
   <Teleport :to="config.teleportTo.value">
      <template v-if="items.data.value.length > 0">
         <!-- Wrapper -->
         <div :ref="elements.wrapper" :style="styles.wrapper" :class="class">
            <!-- List Container -->
            <ol :style="styles.ol" v-bind="{ ...mouseEvents, ...touchEvents }">
               <!-- List Item -->
               <li
                  v-for="(item, index) in items.data.value"
                  :key="`${item.id}_${item.type}`"
                  :data-notivue-id="item.id"
                  :data-notivue-y="config.isTopAlign.value ? 'top' : 'bottom'"
                  :aria-setsize="items.data.value.length"
                  :aria-posinset="index + 1"
                  :ref="elements.items"
                  :style="{
                     ...styles.li,
                     ...item.transitionStyles,
                  }"
               >
                  <!-- Notification Container -->
                  <div
                     :style="styles.item"
                     :class="item.animationClass"
                     @animationstart="item.onAnimationstart"
                     @animationend="item.onAnimationend"
                  >
                     <!-- Notification -->
                     <slot v-bind="getSlotContext(item)" />

                     <!-- Aria Live -->
                     <div
                        aria-atomic="true"
                        :aria-live="item.ariaLive"
                        :role="item.ariaRole"
                        :style="visuallyHidden"
                     >
                        <div>{{ item.title || '' }} {{ item.message }}</div>
                     </div>
                  </div>
               </li>
            </ol>
         </div>
      </template>
   </Teleport>
</template>