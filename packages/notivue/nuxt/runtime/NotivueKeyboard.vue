<script setup lang="ts">
import { toRefs, type Component } from 'vue'

import {
   NotivueKeyboard as NotivueKeyboardClient,
   DEFAULT_KEYBOARD_PROPS,
   type TabIndexValue,
   type ContainersTabIndexMap,
   type NotivueKeyboardProps,
} from 'notivue'

import { NotivueClientOnly } from './client-only'

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_KEYBOARD_PROPS)

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
