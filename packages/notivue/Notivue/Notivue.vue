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
   class: string
}>()

defineSlots<{
   default(item: NotivueSlot): Component
}>()

const config = useConfig()
const items = useItems()
const elements = useElements()

const { staticStyles, dynamicStyles } = useNotivueStyles()

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
         <div
            :ref="elements.wrapper"
            :style="{ ...staticStyles.wrapper, ...config.theme.value }"
            :class="class"
         >
            <!-- Container -->
            <ol :style="staticStyles.container" v-bind="{ ...mouseEvents, ...touchEvents }">
               <!-- Row -->
               <li
                  v-for="(item, index) in items.data.value"
                  :key="`${item.id}_${item.type}`"
                  :data-notivue-id="item.id"
                  :aria-setsize="items.data.value.length"
                  :aria-posinset="index + 1"
                  :ref="elements.items"
                  :style="{
                     ...staticStyles.row,
                     ...dynamicStyles.row,
                     ...item.transitionStyles,
                  }"
               >
                  <!-- Notification Container -->
                  <div
                     :style="{ ...staticStyles.box, ...dynamicStyles.box }"
                     :class="item.animationClass"
                     :data-notivue-y="config.isTopAlign.value ? 'top' : 'bottom'"
                     @animationstart="item.onAnimationstart"
                     @animationend="item.onAnimationend"
                  >
                     <!-- Notification -->
                     <slot v-bind="getSlotContext(item)" />

                     <!-- Live Region -->
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
