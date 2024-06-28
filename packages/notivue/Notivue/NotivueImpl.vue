<script setup lang="ts">
import { Teleport } from 'vue'

import AriaLive from './AriaLive.vue'

import { useStore } from '@/core/useStore'
import { getSlotItem } from '@/core/utils'

import { useMouseEvents } from './composables/useMouseEvents'
import { useTouchEvents } from './composables/useTouchEvents'
import { useNotivueStyles } from './composables/useNotivueStyles'
import { useSizes } from './composables/useSizes'
import { useWindowFocus } from './composables/useWindowFocus'
import { useReducedMotion } from './composables/useReducedMotion'

import { getAriaLabel } from './utils'
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
useWindowFocus()
useSizes()
</script>

<template>
   <Teleport
      :to="config.teleportTo.value === false ? undefined : config.teleportTo.value"
      :disabled="config.teleportTo.value === false"
   >
      <!-- List Container -->
      <ol
         v-if="items.entries.value.length > 0"
         v-bind="{ ...mouseEvents, ...touchEvents, ...elements.rootAttrs.value }"
         :data-notivue-align="config.position.value.split('-')[0]"
         :aria-label="props.listAriaLabel"
         :ref="elements.root"
         :class="props.class"
         :style="{ ...styles.list, ...props.styles?.list }"
      >
         <!-- List Item -->
         <li
            v-for="(item, i) in items.entries.value"
            tabindex="-1"
            :key="item.id"
            :data-notivue-item="item.id"
            :aria-setsize="items.length"
            :aria-posinset="i + 1"
            :ref="elements.items"
            :style="{
               ...styles.listItem,
               ...item.positionStyles,
               ...props.styles?.listItem,
            }"
         >
            <!-- ariaLiveOnly Push Option -->
            <AriaLive v-if="item.ariaLiveOnly" :item="item" />

            <!-- Item Container -->
            <div
               v-else
               v-bind="item.animationAttrs"
               :aria-label="getAriaLabel(item)"
               :tabindex="containersTabIndex?.[item.id] ?? -1"
               :data-notivue-container="item.id"
               :ref="elements.containers"
               :style="{ ...styles.itemContainer, ...props.styles?.itemContainer }"
            >
               <!-- Notification -->
               <slot v-bind="getSlotItem(item)" />
            </div>
         </li>
      </ol>
   </Teleport>
</template>
