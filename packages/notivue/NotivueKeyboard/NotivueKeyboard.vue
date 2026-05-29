<script setup lang="ts">
import NotivueKeyboardImpl from './NotivueKeyboardImpl.vue'

import { type NotivueKeyboardSlot, type NotivueKeyboardProps } from 'notivue'

import { useNotivueInstance } from '@/core/useStore'
import { NotivueClientOnly } from '@/shared/ClientOnly'

import { DEFAULT_PROPS } from './constants'

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_PROPS)

const { isRunning } = useNotivueInstance()

defineSlots<NotivueKeyboardSlot>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueKeyboardImpl v-bind="props" v-if="isRunning">
         <slot />
      </NotivueKeyboardImpl>
   </NotivueClientOnly>
</template>
