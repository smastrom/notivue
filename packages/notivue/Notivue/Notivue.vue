<script setup lang="ts">
import { Teleport, type Component } from 'vue'

import AriaLive from './AriaLive.vue'

import { useStore } from '@/core/useStore'

import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles } from './composables/useNotivueStyles'
import { useRepositioning } from './composables/useRepositioning'
import { useVisibilityChange } from './composables/useVisibilityChange'
import { getSlotContext, getAriaLabel } from './utils'

import type { NotivueItem } from 'notivue'
import type { ContainersTabIndexMap } from '@/NotivueKeyboard/types'

// Props

interface NotivueProps {
   class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
   /**
    * Notification containers reactive tabindex map. Only needed if using NotivueKeyboard.
    *
    * @default undefined
    */
   containersTabIndex?: ContainersTabIndexMap
   /**
    * Aria label for the list container. Only effective if using NotivueKeyboard.
    *
    * @default "Notifications"
    */
   listAriaLabel?: string
}

const props = withDefaults(defineProps<NotivueProps>(), {
   listAriaLabel: 'Notifications',
})

defineSlots<{
   default(item: NotivueItem & { key?: string }): Component
}>()

// Store

const { config, items, elements } = useStore()

// Notivue Composables

const styles = useNotivueStyles()
const mouseEvents = useMouseEvents()
const touchEvents = useTouchEvents()

useVisibilityChange()
useRepositioning()
</script>

<template>
   <Teleport :to="config.teleportTo.value">
      <!-- List Container -->
      <ol
         :aria-label="props.listAriaLabel"
         v-if="items.getLength() > 0"
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
            :aria-setsize="items.getLength()"
            :aria-posinset="index + 1"
            :ref="elements.items"
            :style="{
               ...styles.li,
               ...item.positionStyles,
            }"
         >
            <!-- ariaLiveOnly Push Option -->
            <AriaLive v-if="item.ariaLiveOnly" :item="item" />

            <!-- Notification Container -->
            <div
               v-else
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
