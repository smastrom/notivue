<script setup lang="ts">
import { DEFAULT_PROPS } from './constants'
import { NotivueClientOnly } from '@/shared/ClientOnly'

import NotivueImpl from './NotivueImpl.vue'

import type { NotivueComponentSlot, NotivueProps } from 'notivue'

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

defineSlots<NotivueComponentSlot>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueImpl v-bind="props" v-slot="item">
         <slot v-bind="item" />
      </NotivueImpl>
   </NotivueClientOnly>
</template>
