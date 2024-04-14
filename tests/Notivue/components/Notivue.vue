<script setup lang="ts">
import { ref, shallowRef, toRefs, watchEffect, type Ref } from 'vue'

import {
   push,
   useNotivue,
   useNotivueInstance,
   useNotifications,
   Notivue,
   type PushOptions,
   type NotivueConfig,
   type Push,
} from 'notivue'

import { RESOLVE_REJECT_DELAY } from '@/support/utils'

export type CyNotivueProps = {
   class?: string
   options?: PushOptions
   newOptions?: PushOptions
} & NotivueConfig

const cyProps = defineProps<CyNotivueProps>()

const config = useNotivue()
const { startInstance, stopInstance } = useNotivueInstance()
const { entries, queue } = useNotifications()

const { pauseOnTouch, pauseOnHover, teleportTo, limit, animations, enqueue, avoidDuplicates } =
   toRefs(cyProps)

const autoClearCount = ref(0)
const manualClearCount = ref(0)

/* ====================================================================================
 * Update config when props change
 * ==================================================================================== */

watchEffect(() => {
   if (animations?.value) config.animations.value = animations.value
   if (pauseOnTouch?.value) config.pauseOnTouch.value = pauseOnTouch.value
   if (pauseOnHover?.value) config.pauseOnHover.value = pauseOnHover.value
   if (animations?.value) config.animations.value = animations.value
   if (teleportTo?.value) config.teleportTo.value = teleportTo.value
   if (limit?.value) config.limit.value = limit.value
   if (enqueue?.value) config.enqueue.value = enqueue.value
   if (avoidDuplicates?.value) config.avoidDuplicates.value = avoidDuplicates.value
})

/* ====================================================================================
 * Callbacks used on click events
 * ==================================================================================== */

function pushAndClear() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.clear(), RESOLVE_REJECT_DELAY)
}

function pushAriaLiveOnly() {
   push.success({ title: 'Title', message: 'Message', ariaLiveOnly: true })
}

const pushCallbacks = {
   onAutoClear: () => autoClearCount.value++,
   onManualClear: () => manualClearCount.value++,
}

function pushWithAutoClearCallback() {
   ;(['success', 'error', 'warning', 'info'] as const).forEach((type) => {
      push[type](pushCallbacks)
   })

   push.promise(pushCallbacks).reject(pushCallbacks)
   push.load(pushCallbacks).success(pushCallbacks)
}

function pushWithManualClearCallback() {
   const notifications = [] as ReturnType<Push['success']>[]

   ;(['success', 'error', 'warning', 'info'] as const).forEach((type) => {
      notifications.push(push[type](pushCallbacks))
   })

   notifications.push(push.promise(pushCallbacks).resolve(pushCallbacks))
   notifications.push(push.load(pushCallbacks).error(pushCallbacks))

   notifications.forEach((n) => n.clear())
}

const toBeCleared = shallowRef(null) as unknown as Ref<ReturnType<Push['success']>>

function pushAndRenderClear() {
   toBeCleared.value = push.success(cyProps.options ?? {})
}

function pushAndDestroy() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.destroy(), RESOLVE_REJECT_DELAY)
}

function pushSkipQueue() {
   push.success(cyProps.options ?? { skipQueue: true })
}

async function pushPromiseAndResolve() {
   const promise = push.promise(cyProps.options ?? {})
   await new Promise((resolve) => setTimeout(resolve, RESOLVE_REJECT_DELAY))

   promise.resolve(cyProps.newOptions ?? cyProps.options ?? {})
}

async function pushPromiseAndReject() {
   const promise = push.load(cyProps.options ?? {})
   await new Promise((resolve) => setTimeout(resolve, RESOLVE_REJECT_DELAY))

   promise.error(cyProps.newOptions ?? cyProps.options ?? {})
}
</script>

<template>
   <div>
      <Notivue v-slot="item" :class="cyProps.class || 'Root'">
         <div class="Notification">{{ JSON.stringify(item) }}</div>
         <button class="ClearButton" @click="item.clear">Clear</button>
         <button class="DestroyButton" @click="item.destroy">Destroy</button>
      </Notivue>

      <!-------------------------------- Push methods ---------------------------------->

      <button class="Success" @click="push.success(options ?? {})">Success</button>
      <button class="Error" @click="push.error(options ?? {})">Error</button>
      <button class="Warning" @click="push.warning(options ?? {})">Warning</button>
      <button class="Info" @click="push.info(options ?? {})">Info</button>
      <button class="Promise" @click="push.load(options ?? {})">Promise</button>

      <!-------------------------------- Clear all Tests ---------------------------------->

      <button class="DestroyAll" @click="push.destroyAll">Destroy All</button>
      <button class="ClearAll" @click="push.clearAll">Clear All</button>

      <!-------------------------------- Clear Tests ---------------------------------->

      <button class="PushAndClear" @click="pushAndClear">Push and Clear</button>
      <button class="PushAndDestroy" @click="pushAndDestroy">Push and Destroy</button>

      <button class="PushAndRenderClear" @click="pushAndRenderClear">Push and Render Clear</button>
      <button v-if="toBeCleared" class="RenderedClear" @click="toBeCleared.clear">Clear</button>

      <!-------------------------------- Queue Tests ---------------------------------->

      <button class="PushAriaLiveOnly" @click="pushAriaLiveOnly">Push Aria Live Only</button>
      <button class="PushSkipQueue" @click="pushSkipQueue">Push and skip queue</button>

      <!-------------------------------- Promise Tests ---------------------------------->

      <button class="PushPromiseAndResolve" @click="pushPromiseAndResolve">
         Push Promise and Resolve
      </button>
      <button class="PushPromiseAndReject" @click="pushPromiseAndReject">
         Push Promise and Reject
      </button>

      <!-------------------------------- Callbacks Tests ---------------------------------->

      <button class="PushWithAutoClearCallback" @click="pushWithAutoClearCallback">
         {{ autoClearCount }}
      </button>
      <button class="PushWithManualClearCallback" @click="pushWithManualClearCallback">
         {{ manualClearCount }}
      </button>

      <!-------------------------------- Instance Tests ---------------------------------->

      <button class="StartInstance" @click="startInstance">Start Instance</button>
      <button class="StopInstance" @click="stopInstance">Stop Instance</button>
      <div class="QueueCount">{{ queue.length }}</div>
      <div class="EntriesCount">{{ entries.length }}</div>

      <div class="Config">{{ config }}</div>
   </div>
</template>

<style scoped>
.Notification {
   width: 300px;
   height: 60px;
   overflow: hidden;
}
</style>
