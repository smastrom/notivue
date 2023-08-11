<script setup lang="ts">
import { Teleport, onBeforeUnmount, type Component } from 'vue'

import { useNotivue, useItems, useElements } from '@/core/useStore'

import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles } from './composables/useNotivueStyles'
import { useRepositioning } from './composables/useRepositioning'
import { useVisibilityChange } from './composables/useVisibilityChange'
import { getSlotContext, getAriaLabel } from './utils'

import type { NotivueSlot } from 'notivue'
import type { ContainerTabIndexMap } from '@/NotivueKeyboard/types'

// Props

interface NotivueProps {
   class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
   /**
    * Notification containers tabIndex map. Only needed if using NotivueKeyboard.
    */
   containersTabIndex?: ContainerTabIndexMap
}

const props = defineProps<NotivueProps>()

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
         aria-label="Notifications List"
         v-if="items.entries.value.length > 0"
         v-bind="{ ...mouseEvents, ...touchEvents }"
         :data-notivue-align="config.isTopAlign.value ? 'top' : 'bottom'"
         :ref="elements.wrapper"
         :style="styles.ol"
         :class="props.class"
      >
         <!-- List Item -->
         <li
            v-for="(item, index) in items.entries.value"
            tabindex="-1"
            :key="item.id"
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
               :aria-label="getAriaLabel(item)"
               :tabindex="containersTabIndex?.[item.id] ?? -1"
               :data-notivue-container="item.id"
               :ref="elements.containers"
               :style="styles.item"
               :class="item.animationClass"
               @animationstart="item.onAnimationstart"
               @animationend="item.onAnimationend"
            >
               <!-- Notification -->
               <slot v-bind="getSlotContext(item)" :key="`${item.id}_${item.type}`" />
            </div>
         </li>
      </ol>
   </Teleport>
</template>
