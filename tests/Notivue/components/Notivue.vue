<script setup lang="ts">
import { watch, shallowRef, type Ref, toRef, toRefs } from 'vue'

import {
   usePush,
   useNotivue,
   Notivue,
   type PushOptions,
   type NotivueConfig,
   type Push,
} from 'notivue'

import { GENERIC_UPDATE_DELAY, RESOLVE_REJECT_DELAY } from '@/support/utils'

export type CyNotivueProps = {
   class?: string
   options?: PushOptions
   newOptions?: PushOptions
} & NotivueConfig

const cyProps = defineProps<CyNotivueProps>()

const config = useNotivue()
const push = usePush()

const rPauseOnTouch = toRef(cyProps, 'pauseOnTouch')
const rPauseOnHover = toRef(cyProps, 'pauseOnHover')
const rTeleport = toRef(cyProps, 'teleportTo')
const rLimit = toRef(cyProps, 'limit')
const rAnimations = toRef(cyProps, 'animations')
const rEnqueue = toRef(cyProps, 'enqueue')

watch(rPauseOnTouch, (newVal) => (config.pauseOnTouch.value = newVal))
watch(rPauseOnHover, (newVal) => (config.pauseOnHover.value = newVal))

watch(rAnimations, (newVal) => {
   if (newVal) config.animations.value = newVal
})

watch(rTeleport, (newVal) => {
   if (newVal) config.teleportTo.value = newVal as string
})

watch(rLimit, (newVal) => {
   if (newVal) config.limit.value = newVal
})

watch(rEnqueue, (newVal) => {
   if (newVal) config.enqueue.value = newVal
})

async function randomPromise() {
   const promise = push.promise(cyProps.options ?? {})

   try {
      await new Promise((resolve, reject) =>
         setTimeout(Math.random() > 0.5 ? resolve : reject, GENERIC_UPDATE_DELAY)
      )
      promise.resolve(cyProps.options ?? {})
   } catch (error) {
      promise.reject(cyProps.options ?? {})
   }
}

function pushAndClear() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.clear(), GENERIC_UPDATE_DELAY)
}

function pushAriaLiveOnly() {
   push.success({ title: 'Title', message: 'Message', ariaLiveOnly: true })
}

const toBeCleared = shallowRef(null) as unknown as Ref<ReturnType<Push['success']>>

function pushAndRenderClear() {
   toBeCleared.value = push.success(cyProps.options ?? {})
}

function pushAndDestroy() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.destroy(), GENERIC_UPDATE_DELAY)
}

function pushSkipQueue() {
   push.success(cyProps.options ?? { skipQueue: true })
}

async function pushPromiseAndResolve() {
   const promise = push.promise({ ...cyProps.options, duration: Infinity } ?? {})
   await new Promise((resolve) => setTimeout(resolve, RESOLVE_REJECT_DELAY))

   promise.resolve(cyProps.newOptions ?? cyProps.options ?? {})
}

async function pushPromiseAndReject() {
   const promise = push.promise({ ...cyProps.options, duration: Infinity } ?? {})
   await new Promise((resolve) => setTimeout(resolve, RESOLVE_REJECT_DELAY))

   promise.reject(cyProps.newOptions ?? cyProps.options ?? {})
}
</script>

<template>
   <div>
      <Notivue v-slot="item" :class="cyProps.class || 'Root'">
         <div class="Notification">{{ JSON.stringify(item) }}</div>
         <button class="ClearButton" @click="item.clear">Clear</button>
         <button class="DestroyButton" @click="item.destroy">Destroy</button>
      </Notivue>

      <button class="Success" @click="push.success(options ?? {})">Success</button>
      <button class="Error" @click="push.error(options ?? {})">Error</button>
      <button class="Warning" @click="push.warning(options ?? {})">Warning</button>
      <button class="Info" @click="push.info(options ?? {})">Info</button>
      <button class="Promise" @click="push.promise(options ?? {})">Promise</button>

      <button class="DestroyAll" @click="push.destroyAll">Destroy All</button>
      <button class="ClearAll" @click="push.clearAll">Clear All</button>

      <button class="PushAndClear" @click="pushAndClear">Push and Clear</button>
      <button class="PushAndDestroy" @click="pushAndDestroy">Push and Destroy</button>

      <button class="PushAriaLiveOnly" @click="pushAriaLiveOnly">Push Aria Live Only</button>
      <button class="PushSkipQueue" @click="pushSkipQueue">Push and skip queue</button>

      <button class="PushAndRenderClear" @click="pushAndRenderClear">Push and Render Clear</button>
      <button v-if="toBeCleared" class="RenderedClear" @click="toBeCleared.clear">Clear</button>

      <button class="RandomPromise" @click="randomPromise">Push and Resolve/Reject Promise</button>
      <button class="PushPromiseAndResolve" @click="pushPromiseAndResolve">
         Push Promise and Resolve
      </button>
      <button class="PushPromiseAndReject" @click="pushPromiseAndReject">
         Push Promise and Reject
      </button>
   </div>
</template>

<style scoped>
.Notification {
   width: 300px;
   height: 60px;
   overflow: hidden;
}
</style>
