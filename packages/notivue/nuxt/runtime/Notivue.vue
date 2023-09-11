<script setup lang="ts">
import type { Component } from 'vue'

import { Notivue as NotivueClient, type NotivueItem, type NotivueProps } from 'notivue'

import { NotivueClientOnly } from './client-only'

const props = withDefaults(defineProps<NotivueProps>(), { listAriaLabel: 'Notifications' })

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
