<script setup lang="ts">
import type { Component } from 'vue'

import { Notivue as NotivueClient, type NotivueItem } from 'notivue'

import { NotivueClientOnly } from './client-only'

const props = withDefaults(
   defineProps<{
      class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
      containersTabIndex?: Record<string, 0 | -1>
      listAriaLabel?: string
   }>(),
   { listAriaLabel: 'Notifications' }
)

defineSlots<{
   default(item: NotivueItem & { key?: string }): Component
}>()
</script>

<template>
   <NotivueClientOnly>
      <NotivueClient v-bind="props" v-slot="item">
         <slot v-bind="item" />
      </NotivueClient>
   </NotivueClientOnly>
</template>
