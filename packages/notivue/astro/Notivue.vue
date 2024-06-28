<script setup lang="ts">
import { onMounted, onBeforeUnmount, getCurrentInstance, provide } from 'vue'

import { DEFAULT_PROPS } from '@/Notivue/constants'
import { NotivueClientOnly } from '@/shared/ClientOnly'
import { createProvides } from '@/core/createNotivue'
import { notivueInjectionKey, notivueInstanceInjectionKey } from '@/core/symbols'

import NotivueImpl from '@/Notivue/NotivueImpl.vue'

import type { NotivueConfig, NotivueComponentSlot, NotivueProps } from 'notivue'
import type { PushAstroEvent } from './types'

const props = withDefaults(defineProps<NotivueProps>(), DEFAULT_PROPS)

defineSlots<NotivueComponentSlot>()

/* ====================================================================================
 * Setup Store
 * ==================================================================================== */

const pluginConfig = getCurrentInstance()?.appContext.config.globalProperties
   .notivuePluginConfig as NotivueConfig & {
   startOnCreation?: boolean
}

const { startOnCreation = true, ...userConfig } = pluginConfig || {}

const { store, instance, push } = createProvides(startOnCreation, userConfig)

provide(notivueInstanceInjectionKey, instance)
provide(notivueInjectionKey, store)

/* ====================================================================================
 * Listen for custom events dispatached by push
 * ==================================================================================== */

function onPush(e: CustomEvent<PushAstroEvent>) {
   // Create the notification as usual
   const notification = push[e.detail.type](e.detail)

   // Dispatch the result
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
