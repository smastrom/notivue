<script setup lang="ts">
import { Notivue, NotivueSwipe, usePush } from 'notivue'

import { SWIPE_NOTIFICATION_WIDTH } from '@/support/utils'

export interface CyNotivueSwipeProps {
   disabled?: boolean
   touchOnly?: boolean
   threshold?: number
   exclude?: string
}

const cyProps = defineProps<CyNotivueSwipeProps>()

const push = usePush()

function pushPromise() {
   push.promise({
      title: 'Promise',
      message: 'This is a promise notification and should not be swipeable',
      duration: 10000,
   })
}

function pushSuccess() {
   push.success({
      title: 'Success',
      message: 'This is a success notification and should be swipeable',
      duration: 10000,
   })
}
</script>

<template>
   <Notivue v-slot="item">
      <NotivueSwipe
         :item="item"
         :disabled="cyProps.disabled"
         :touchOnly="cyProps.touchOnly"
         :threshold="cyProps.threshold"
         :exclude="cyProps.exclude"
      >
         <div
            class="SwipeNotification"
            :style="{
               '--nv-swipe-width': `${SWIPE_NOTIFICATION_WIDTH}px`,
            }"
         >
            <h3>{{ item.title }}</h3>
            <p>{{ item.message }}</p>
            <button class="CloseButton" @click="item.clear">Close</button>
            <a href="#" class="Link">Link</a>
         </div>
      </NotivueSwipe>
   </Notivue>

   <button class="Success" @click="pushSuccess">Push Success</button>
   <button class="Promise" @click="pushPromise">Push Promise</button>
</template>

<style scoped>
.SwipeNotification {
   background-color: white;
   padding: 1rem;
   border: 2px solid green;
   max-width: 100%;
   width: var(--nv-swipe-width);

   & * {
      margin: 0;
   }
}
</style>
