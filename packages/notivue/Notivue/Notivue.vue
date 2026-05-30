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
      <NotivueImpl
         v-if="isRunning"
         v-slot="item"
         :class="props.class"
         :listAriaLabel="props.listAriaLabel"
         :styles="props.styles"
         :teleportTo="props.teleportTo ?? null"
      >
         <slot v-bind="item" />
      </NotivueImpl>
   </NotivueClientOnly>
</template>
