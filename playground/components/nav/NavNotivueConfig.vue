<script setup lang="ts">
const config = useNotivue()
const { queue } = useNotifications()
const { state, actions, messages } = useStore()

function togglePauseOnHover() {
   config.update((prevConf) => ({
      pauseOnHover: !prevConf.pauseOnHover,
   }))
}

function toggleRtlIfNeeded() {
   if (state.rtl) actions.toggleRTL()
}

function togglePauseOnTouch() {
   toggleRtlIfNeeded()

   config.update((prevConf) => ({
      pauseOnTouch: !prevConf.pauseOnTouch,
   }))
}

function toggleQueue() {
   toggleRtlIfNeeded()

   config.update((prevConf) => ({
      enqueue: !prevConf.enqueue,
   }))
}

function toggleNoDupes() {
   push.destroyAll()

   config.update((prevConf) => ({
      avoidDuplicates: !prevConf.avoidDuplicates,
   }))

   if (config.avoidDuplicates.value) state.hasProgress = true

   push.success(messages.value.success)
}

const enqueuedLength = computed(() => queue.value.length)
const isEnqueueDisabled = computed(() => config.limit.value === Infinity)
const isSwipeDisabled = computed(() => !config.pauseOnHover.value)

watch(
   () => !config.pauseOnHover.value && state.enableSwipe,
   (isPauseOnHoverDisabled) => {
      if (isPauseOnHoverDisabled) state.enableSwipe = false
   }
)

watch(
   () => state.enableSwipe,
   (isEnabled) => {
      toggleRtlIfNeeded()

      push.info({
         title: `Swipe to dismiss ${isEnabled ? 'on' : 'off'}`,
         message: isEnabled
            ? 'Swipe a notification left or right to dismiss it.'
            : 'Turn "Clear on Swipe" back on to try swipe-to-dismiss.',
      })
   }
)

watch(config.limit, () => {
   toggleRtlIfNeeded()
})

const btnProps = {
   class: 'ButtonBase SwitchButton',
   role: 'switch',
}
</script>

<template>
   <div class="Controls">
      <button
         v-if="isMobile()"
         v-bind="btnProps"
         :aria-checked="config.pauseOnTouch.value"
         @click="togglePauseOnTouch"
      >
         Pause on Touch
      </button>

      <button
         v-else
         v-bind="btnProps"
         :aria-checked="config.pauseOnHover.value"
         @click="togglePauseOnHover"
      >
         Pause on Hover
      </button>

      <button
         v-bind="btnProps"
         :disabled="isSwipeDisabled"
         :aria-checked="state.enableSwipe"
         @click="actions.toggleSwipe"
      >
         Clear on Swipe
      </button>

      <button v-bind="btnProps" :aria-checked="config.avoidDuplicates.value" @click="toggleNoDupes">
         No Duplicates
      </button>

      <select
         class="ButtonBase Select"
         v-model="config.limit.value"
         aria-label="Maximum notifications on screen"
      >
         <option selected :value="Infinity">No limit</option>
         <option :value="1">Max 1</option>
         <option :value="3">Max 3</option>
         <option :value="5">Max 5</option>
         <option :value="10">Max 10</option>
      </select>

      <button
         v-bind="btnProps"
         :aria-checked="config.enqueue.value"
         @click="toggleQueue"
         :disabled="isEnqueueDisabled"
      >
         Queue ({{ enqueuedLength }})
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
   display: flex;
   padding-right: 1rem;
   cursor: pointer;

   -webkit-appearance: none;
   appearance: none;

   background-image: url("data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
   background-position: right 0.45em top 50%;
   background-repeat: no-repeat;
   background-size: auto 1rem;
}
</style>
