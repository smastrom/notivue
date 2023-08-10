<script setup lang="ts">
import { computed, watch } from 'vue'
import { useNotifications, useNotivue, usePush } from 'notivue'

import {
   store,
   toggleRenderTitles as _toggleRenderTitles,
   toggleRTL as _toggleRTL,
   toggleSwipe,
   toggleRTL,
} from '@/lib/store'
import { isMobile } from '@/lib/utils'

const push = usePush()
const config = useNotivue()
const { queue } = useNotifications()

const enqueuedLength = computed(() => queue.value.length)

function togglePauseOnHover() {
   store.rtl = false
   config.pauseOnHover.value = !config.pauseOnHover.value

   push.info({
      title: `Pause on hover ${config.pauseOnHover.value ? 'enabled' : 'disabled'}`,
      message: config.pauseOnHover.value
         ? 'Notifications will be paused on hover.'
         : 'Notifications will not be paused on hover.',
   })
}

function togglePauseOnTouch() {
   if (store.rtl) toggleRTL()

   config.pauseOnTouch.value = !config.pauseOnTouch.value

   push.info({
      title: `Pause on touch ${config.pauseOnTouch.value ? 'enabled' : 'disabled'}`,
      message: config.pauseOnTouch.value
         ? 'Notifications will be paused on touch.'
         : 'Notifications will not be paused on touch.',
   })
}

function toggleQueue() {
   if (store.rtl) toggleRTL()
   config.enqueue.value = !config.enqueue.value

   if (config.enqueue.value && config.limit.value === Infinity) {
      config.limit.value = 1
   }

   push.info({
      title: `Enqueue ${config.enqueue.value ? 'enabled' : 'disabled'}`,
      message: config.enqueue.value
         ? 'Notifications will be queued if limit is reached.'
         : 'Notifications will be discarded if limit is reached.',
   })
}

watch(
   () => !config.pauseOnHover.value && store.enableSwipe,
   (isPauseOnHoverDisabled) => {
      if (isPauseOnHoverDisabled) {
         store.enableSwipe = false
      }
   },
   { flush: 'post' }
)

watch(
   () => store.enableSwipe,
   (isEnabled) => {
      if (store.rtl) toggleRTL()

      push.info({
         title: `Swipe to clear ${isEnabled ? 'enabled' : 'disabled'}`,
         message: isEnabled
            ? 'Swipe left or right on a notification to clear it.'
            : 'Enable it again to use it.',
      })
   },
   { flush: 'post' }
)

watch(
   () => config.limit.value,
   (newLimit) => {
      const message =
         newLimit === 1
            ? 'Maximum 1 notification will be displayed.'
            : newLimit === Infinity
            ? 'Unlimited notifications will be displayed.'
            : `Maximum ${newLimit} notifications will be displayed.`

      if (store.rtl) toggleRTL()

      push.info({
         title: 'Limit updated!',
         message: message + ' Any limit can be set.',
      })
   }
)
</script>

<template>
   <div class="Controls">
      <button
         v-if="isMobile"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.pauseOnTouch.value"
         aria-label="Pause on Touch"
         @click="togglePauseOnTouch"
      >
         Pause on Touch
      </button>
      <button
         v-else
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.pauseOnHover.value"
         aria-label="Pause on Hover"
         @click="togglePauseOnHover"
      >
         Pause on Hover
      </button>
      <button
         class="ButtonBase SwitchButton"
         :disabled="!config.pauseOnHover.value || !config.pauseOnTouch.value"
         role="switch"
         :aria-checked="store.enableSwipe"
         aria-label="Clear on Swipe"
         @click="toggleSwipe"
      >
         Clear on Swipe
      </button>

      <select class="ButtonBase Select" v-model="config.limit.value" aria-label="Limit">
         <option selected :value="Infinity">Unlimited</option>
         <option :value="1">Limit - 1</option>
         <option :value="3">Limit - 3</option>
         <option :value="5">Limit - 5</option>
         <option :value="10">Limit - 10</option>
      </select>

      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.enqueue.value"
         aria-label="Enqueue"
         @click="toggleQueue"
         :disabled="config.limit.value === Infinity"
      >
         Enqueue ({{ enqueuedLength }})
      </button>
   </div>
</template>

<style scoped>
.Controls {
   display: grid;
   gap: 10px;
   grid-auto-flow: row;
}

.Select {
   text-align: center;
   padding-left: 1.25em;
}
</style>
