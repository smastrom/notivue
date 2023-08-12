<script setup lang="ts">
import { usePush, useNotivue, Notivue, type UserPushOptions, Push } from 'notivue'

import { toRef, watch, shallowRef, type Ref } from 'vue'

import { RESOLVE_REJECT_DELAY } from '@/support/utils'

const config = useNotivue()

const push = usePush()

const cyProps = defineProps<{
   options?: UserPushOptions
   newOptions?: UserPushOptions
   class?: string
   pauseOnTouch?: boolean
   pauseOnHover?: boolean
   animations?: {
      enter: string
      leave: string
      clearAll: string
   }
   teleportTo?: string
   limit?: number
}>()

const rPauseOnTouch = toRef(cyProps, 'pauseOnTouch')
const rPauseOnHover = toRef(cyProps, 'pauseOnHover')
const rAnimations = toRef(cyProps, 'animations')
const rTeleportTo = toRef(cyProps, 'teleportTo')
const rLimit = toRef(cyProps, 'limit')

watch(rPauseOnTouch, (newValue) => {
   config.pauseOnTouch.value = newValue
})

watch(rPauseOnHover, (newValue) => {
   config.pauseOnHover.value = newValue
})

watch(rAnimations, (newValue) => {
   if (!newValue) return
   config.animations.value = newValue
})

watch(rTeleportTo, (newValue) => {
   if (!newValue) return
   config.teleportTo.value = newValue
})

watch(rLimit, (newValue) => {
   if (!newValue) return
   config.limit.value = newValue
})

async function randomPromise() {
   const promise = push.promise(cyProps.options ?? {})

   try {
      await new Promise((resolve, reject) =>
         setTimeout(Math.random() > 0.5 ? resolve : reject, 3000)
      )
      promise.resolve(cyProps.options ?? {})
   } catch (error) {
      promise.reject(cyProps.options ?? {})
   }
}

function pushAndClear() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.clear(), 1000)
}

const toBeCleared = shallowRef(null) as unknown as Ref<ReturnType<Push['success']>>

function pushAndRenderClear() {
   toBeCleared.value = push.success(cyProps.options ?? {})
}

function pushAndDestroy() {
   const notification = push.success(cyProps.options ?? {})
   setTimeout(() => notification.destroy(), 1000)
}

async function pushPromiseAndResolve() {
   const promise = push.promise(cyProps.options ?? {})
   await new Promise((resolve) => setTimeout(resolve, RESOLVE_REJECT_DELAY))

   promise.resolve(cyProps.newOptions ?? cyProps.options ?? {})
}

async function pushPromiseAndReject() {
   const promise = push.promise(cyProps.options ?? {})
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
