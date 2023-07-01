<script setup lang="ts">
import { toRef, watch } from 'vue'

import { usePush, useNotivue, Notivue } from 'notivue'

const push = usePush()
const config = useNotivue()

const cyProps = defineProps<{ pauseOnTouch?: boolean; pauseOnHover?: boolean }>()

const rPauseOnTouch = toRef(cyProps, 'pauseOnTouch')
const rPauseOnHover = toRef(cyProps, 'pauseOnHover')

watch(rPauseOnTouch, (newValue) => {
   config.pauseOnTouch.value = newValue
})

watch(rPauseOnHover, (newValue) => {
   config.pauseOnHover.value = newValue
})
</script>

<template>
   <div :data-touch-active="rPauseOnTouch" :data-hover-active="rPauseOnHover">
      <Notivue v-slot="item">
         <div style="height: 150px; width: 400px">{{ JSON.stringify(item) }}</div>
      </Notivue>

      <button class="Push" @click="push.success('Success')">Success</button>
   </div>
</template>
