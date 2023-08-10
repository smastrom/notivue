<script setup lang="ts">
import { Teleport, onBeforeUnmount, type Component } from 'vue'

import { useNotivue, useItems, useElements } from '@/core/useStore'
import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles, visuallyHidden } from './composables/useNotivueStyles'
import { useRepositioning } from './composables/useRepositioning'
import { useVisibilityChange } from './composables/useVisibilityChange'
import { getSlotContext } from './utils'

import type { NotivueSlot } from 'notivue'

// Props

const props = withDefaults(
   defineProps<{
      class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
      /**
       * Whether to render the aria-live region.
       */
      renderAriaLive?: boolean
      /**
       * Aria-live aria-hidden dynamic attribute. Only needed if using NotivueKeyboard.
       */
      ariaHidden?: 'true' | 'false'
      /**
       * Notification container dynamic tabIndex. Only needed if using NotivueKeyboard.
       */
      tabIndex?: 0 | -1
   }>(),
   { renderAriaLive: true, ariaHidden: 'false', tabIndex: -1 }
)

defineSlots<{
   default(item: NotivueSlot & { key?: string }): Component
}>()

// Store

const config = useNotivue()
const items = useItems()
const elements = useElements()

// Notivue Composables

const styles = useNotivueStyles()
const mouseEvents = useMouseEvents()
const touchEvents = useTouchEvents()

useVisibilityChange()
useRepositioning()

// Lifecycle

onBeforeUnmount(() => {
   items.reset()
})
</script>

<template>
   <Teleport :to="config.teleportTo.value">
      <!-- List Container -->
      <ol
         :data-notivue-top="config.isTopAlign.value"
         :ref="elements.wrapper"
         :style="styles.ol"
         v-bind="{ ...mouseEvents, ...touchEvents }"
         :class="props.class"
         v-if="items.entries.value.length > 0"
      >
         <!-- List Item -->
         <li
            v-for="(item, index) in items.entries.value"
            :key="item.id"
            tabindex="-1"
            :data-notivue-id="item.id"
            :aria-setsize="items.entries.value.length"
            :aria-posinset="index + 1"
            :ref="elements.items"
            :style="{
               ...styles.li,
               ...item.positionStyles,
            }"
         >
            <!-- Notification Container -->
            <div
               :tabIndex="props.tabIndex"
               :data-notivue-id="item.id"
               :ref="elements.containers"
               :style="styles.item"
               :class="item.animationClass"
               @animationstart="item.onAnimationstart"
               @animationend="item.onAnimationend"
            >
               <!-- Notification -->
               <slot v-bind="getSlotContext(item)" :key="`${item.id}_${item.type}`" />
            </div>

            <!-- Aria Live -->
            <div
               v-if="props.renderAriaLive"
               aria-atomic="true"
               :aria-live="item.ariaLive"
               :role="item.ariaRole"
               :style="visuallyHidden"
               :aria-hidden="props.ariaHidden"
            >
               {{ item.title ? `${item.title}: ` : '' }}{{ item.message }}
            </div>
         </li>
      </ol>
   </Teleport>
</template>
