<script setup lang="ts">
import { DEFAULT_PROPS } from './constants'
import { ClientOnly } from '@/shared/ClientOnly'

import Notivue from './Notivue.vue'

import type { NotivueComponentSlot, NotivueProps } from 'notivue'

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

defineSlots<NotivueComponentSlot>()
</script>

<template>
   <ClientOnly>
      <Notivue v-bind="props" v-slot="item">
         <slot v-bind="item" />
      </Notivue>
   </ClientOnly>
</template>
