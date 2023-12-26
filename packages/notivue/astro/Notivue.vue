<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { DEFAULT_PROPS } from '@/Notivue/constants'
import { NotivueClientOnly } from '@/shared/ClientOnly'
import { push } from '@/core/createPush'

import NotivueImpl from '@/Notivue/NotivueImpl.vue'

import type { NotivueComponentSlot, NotivueProps } from 'notivue'
import type { PushAstroEvent } from './types'

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

defineSlots<NotivueComponentSlot>()

function onPush(e: CustomEvent<PushAstroEvent>) {
   // Create the notification as usual
   const notification = push[e.detail.type](e.detail)

   // Dispatch the push result
   window.dispatchEvent(
      new CustomEvent(e.detail.resultEventName, {
         detail: notification,
      })
   )
}

const onClearAll = () => push.clearAll()
const onDestroyAll = () => push.destroyAll()

// Listen for custom events
const events = [
   ['notivue:push', onPush],
   ['notivue:clear-all', onClearAll],
   ['notivue:destroy-all', onDestroyAll],
] as [keyof WindowEventMap, EventListener][]

onMounted(() => {
   events.forEach(([e, handler]) => window.addEventListener(e, handler))
})

onBeforeUnmount(() => {
   events.forEach(([e, handler]) => window.removeEventListener(e, handler))
})
</script>

<template>
   <NotivueClientOnly>
      <NotivueImpl v-bind="props" v-slot="item">
         <slot v-bind="item" />
      </NotivueImpl>
   </NotivueClientOnly>
</template>
