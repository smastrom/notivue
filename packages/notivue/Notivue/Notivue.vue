<script setup lang="ts">
import { computed, Teleport } from 'vue'

import AriaLive from './AriaLive.vue'

import { useStore } from '@/core/useStore'
import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles } from './composables/useNotivueStyles'
import { useRepositioning } from './composables/useRepositioning'
import { useVisibilityChange } from './composables/useVisibilityChange'
import { useReducedMotion } from './composables/useReducedMotion'
import { getSlotContext, getAriaLabel } from './utils'
import { DEFAULT_PROPS } from './constants'

import type { NotivueProps, NotivueComponentSlot } from 'notivue'

// Props

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

defineSlots<NotivueComponentSlot>()

// Store

const { config, items, elements } = useStore()

// Composables

const styles = useNotivueStyles()
const mouseEvents = useMouseEvents()
const touchEvents = useTouchEvents()

useReducedMotion()
useVisibilityChange()
useRepositioning()

// Computed

const dataAlign = computed(() => ({
   'data-notivue-align': config.isTopAlign.value ? 'top' : 'bottom',
}))
</script>

<template>
   <Teleport :to="config.teleportTo.value">
      <!-- List Container -->
      <ol
         v-if="items.getLength() > 0"
         v-bind="{ ...mouseEvents, ...touchEvents, ...elements.rootAttrs.value, ...dataAlign }"
         :aria-label="props.listAriaLabel"
         :ref="elements.root"
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
               v-bind="item.animationAttrs"
               :aria-label="getAriaLabel(item)"
               :tabindex="containersTabIndex?.[item.id] ?? -1"
               :data-notivue-container="item.id"
               :ref="elements.containers"
               :style="styles.item"
            >
               <!-- Notification -->
               <slot v-bind="getSlotContext(item)" :key="`${item.id}_${item.type}`" />
            </div>
         </li>
      </ol>
   </Teleport>
</template>
