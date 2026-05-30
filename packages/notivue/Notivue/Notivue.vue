<script setup lang="ts">
import NotivueImpl from './NotivueImpl.vue'

import type { NotivueComponentSlot, NotivueProps } from 'notivue'

import { useNotivueInstance } from '@/core/useStore'
import { NotivueClientOnly } from '@/shared/ClientOnly'

import { DEFAULT_PROPS } from './constants'

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

const { isRunning } = useNotivueInstance()

defineSlots<NotivueComponentSlot>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueImpl v-bind="props" v-slot="item" v-if="isRunning">
         <slot v-bind="item" />
      </NotivueImpl>
   </NotivueClientOnly>
</template>
