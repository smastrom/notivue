<script setup lang="ts">
import AriaLive from './AriaLive.vue'

import type { NotivueProps, NotivueComponentSlot } from 'notivue'

import { Teleport } from 'vue'

import { useStore } from '@/core/useStore'
import { getSlotItem } from '@/core/utils'

import { DEFAULT_IMPL_PROPS } from './constants'

import { useFocusEvents } from './composables/useFocusEvents'
import { useMouseEvents } from './composables/useMouseEvents'
import { useNotivueStyles } from './composables/useNotivueStyles'
import { useReducedMotion } from './composables/useReducedMotion'
import { useSizes } from './composables/useSizes'
import { useTouchEvents } from './composables/useTouchEvents'
import { useWindowFocus } from './composables/useWindowFocus'
import { getAriaLabel } from './utils'

// Props

type NotivueImplProps = Omit<NotivueProps, 'teleportTo'> & {
   teleportTo?: NotivueProps['teleportTo'] | null
}

const props = withDefaults(defineProps<NotivueImplProps>(), DEFAULT_IMPL_PROPS)

defineSlots<NotivueComponentSlot>()

// Store

const { config, items, elements } = useStore()

// Composables

const styles = useNotivueStyles()
const focusEvents = useFocusEvents()
const mouseEvents = useMouseEvents()
const touchEvents = useTouchEvents()

useReducedMotion()
useWindowFocus()
useSizes()

function getTeleportChoice() {
   return props.teleportTo === null ? config.teleportTo.value : props.teleportTo
}

function getTeleportTo() {
   const choice = getTeleportChoice()

   return choice === false ? undefined : choice
}
</script>

<template>
   <Teleport :to="getTeleportTo()" :disabled="getTeleportChoice() === false">
      <!-- List Container -->
      <ol
         v-if="items.entries.value.length > 0"
         v-bind="{ ...focusEvents, ...mouseEvents, ...touchEvents, ...elements.rootAttrs.value }"
         data-notivue-list=""
         :data-notivue-align="config.position.value.split('-')[0]"
         :aria-label="props.listAriaLabel"
         :ref="elements.root"
         :class="props.class"
         :style="{ ...styles.list, ...props.styles?.list }"
      >
         <!-- List Item -->
         <li
            v-for="(item, i) in items.entries.value"
            :tabindex="item.ariaLiveOnly ? undefined : -1"
            :key="item.id"
            :data-notivue-list-item="item.id"
            :aria-label="item.ariaLiveOnly ? undefined : getAriaLabel(item)"
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
            <AriaLive v-if="item.ariaLiveOnly" :item="item" data-notivue-aria-live="" />

            <!-- Item Container -->
            <div
               v-else
               v-bind="item.animationAttrs"
               :data-notivue-item="item.id"
               :ref="elements.itemContainers"
               :style="{ ...styles.itemContainer, ...props.styles?.itemContainer }"
            >
               <!-- Notification -->
               <slot v-bind="getSlotItem(item)" />
            </div>
         </li>
      </ol>
   </Teleport>
</template>
