<script setup lang="ts">
import { toRefs, type Component } from 'vue'

import {
   NotivueKeyboard as NotivueKeyboardClient,
   DEFAULT_KEYBOARD_PROPS,
   type TabIndexValue,
   type ContainersTabIndexMap,
} from 'notivue'

import { NotivueClientOnly } from './client-only'

const props = withDefaults(
   defineProps<{
      comboKey?: string
      handleClicks?: boolean
      leaveMessage?: string
      emptyMessage?: string
      renderAnnouncement?: boolean
      maxAnnouncements?: number
   }>(),
   DEFAULT_KEYBOARD_PROPS
)

const { comboKey, handleClicks, leaveMessage, emptyMessage, renderAnnouncement, maxAnnouncements } =
   toRefs(props)

defineSlots<{
   default(props: {
      elementsTabIndex: TabIndexValue
      containersTabIndex: ContainersTabIndexMap
   }): Component
}>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueKeyboardClient
         v-bind="{
            comboKey,
            handleClicks,
            leaveMessage,
            emptyMessage,
            renderAnnouncement,
            maxAnnouncements,
         }"
         v-slot="{ containersTabIndex, elementsTabIndex }"
      >
         <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
      </NotivueKeyboardClient>
   </NotivueClientOnly>
</template>
