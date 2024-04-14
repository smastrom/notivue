<script setup lang="ts">
import { useNotivueInstance } from '@/core/useStore'
import { DEFAULT_PROPS } from './constants'

import { NotivueClientOnly } from '@/shared/ClientOnly'

import NotivueKeyboardImpl from './NotivueKeyboardImpl.vue'

import { type NotivueKeyboardSlot, type NotivueKeyboardProps } from 'notivue'

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_PROPS)

const { isRunning } = useNotivueInstance()

defineSlots<NotivueKeyboardSlot>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueKeyboardImpl
         v-bind="props"
         v-slot="{ containersTabIndex, elementsTabIndex }"
         v-if="isRunning"
      >
         <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
      </NotivueKeyboardImpl>
   </NotivueClientOnly>
</template>
