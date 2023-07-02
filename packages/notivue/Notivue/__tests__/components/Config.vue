<script setup lang="ts">
import { toRef, watch } from 'vue'

import { usePush, useNotivue, Notivue } from 'notivue'

const push = usePush()
const config = useNotivue()

const cyProps = defineProps<{
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
</script>

<template>
   <div :data-touch-active="rPauseOnTouch" :data-hover-active="rPauseOnHover">
      <Notivue v-slot="item" class="Root">
         <div style="height: 150px; width: 400px">{{ JSON.stringify(item) }}</div>
      </Notivue>

      <button class="Success" @click="push.success('Success')">Success</button>
      <button class="ClearAll" @click="push.clearAll">Clear All</button>
   </div>
</template>
