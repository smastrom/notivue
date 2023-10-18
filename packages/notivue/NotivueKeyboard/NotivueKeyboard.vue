<script setup lang="ts">
import { NotivueClientOnly } from '@/shared/ClientOnly'
import { DEFAULT_PROPS } from './constants'

import NotivueKeyboardImpl from './NotivueKeyboardImpl.vue'

import type { NotivueKeyboardSlot, NotivueKeyboardProps } from 'notivue'

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_PROPS)

defineSlots<NotivueKeyboardSlot>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueKeyboardImpl v-bind="props" v-slot="{ containersTabIndex, elementsTabIndex }">
         <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
      </NotivueKeyboardImpl>
   </NotivueClientOnly>
</template>
