<script setup lang="ts">
import { ClientOnly } from '@/shared/ClientOnly'
import { DEFAULT_PROPS } from './constants'

import NotivueKeyboard from './NotivueKeyboard.vue'

import type { NotivueKeyboardSlot, NotivueKeyboardProps } from 'notivue'

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_PROPS)

defineSlots<NotivueKeyboardSlot>()
</script>

<template>
   <ClientOnly>
      <NotivueKeyboard v-bind="props" v-slot="{ containersTabIndex, elementsTabIndex }">
         <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
      </NotivueKeyboard>
   </ClientOnly>
</template>
