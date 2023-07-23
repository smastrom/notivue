<script setup lang="ts">
import { watch } from 'vue'
import { useNotivue, usePush } from 'notivue'

import {
   store,
   toggleRenderTitles as _toggleRenderTitles,
   toggleRTL as _toggleRTL,
   toggleOutlinedIcons,
   toggleEmojis,
   messages,
   toggleSwipe,
} from '../../lib/store'
import { isMobile } from '../../lib/utils'

const config = useNotivue()
const push = usePush()

function togglePauseOnHover() {
   config.pauseOnHover.value = !config.pauseOnHover.value
}

function togglePauseOnTouch() {
   config.pauseOnTouch.value = !config.pauseOnTouch.value
}

async function toggleRenderTitles() {
   _toggleRenderTitles()

   push.destroyAll()
   push.success(messages.value.success)
}

function toggleRTL() {
   _toggleRTL()

   push.destroyAll()
   push.success(messages.value.success)
}

watch(
   () => (!config.pauseOnHover.value || !config.pauseOnTouch.value) && store.enableSwipe,
   (isPauseOnHoverDisabled) => {
      if (isPauseOnHoverDisabled) {
         store.enableSwipe = false
      }
   },
   { flush: 'post' }
)

watch(
   () => store.enableSwipe,
   () => {
      push.destroyAll()
      push.success(messages.value.success)
   },
   { flush: 'post' }
)
</script>

<template>
   <div class="Controls">
      <div
         v-if="isMobile"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.pauseOnTouch.value"
         aria-label="Pause on Touch"
         @click="togglePauseOnTouch"
      >
         Pause on Touch
      </div>
      <div
         v-else
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.pauseOnHover.value"
         aria-label="Pause on Hover"
         @click="togglePauseOnHover"
      >
         Pause on Hover
      </div>
      <div
         :class="[
            'ButtonBase',
            'SwitchButton',
            {
               ButtonBase_Disabled: !config.pauseOnHover.value || !config.pauseOnTouch.value,
            },
         ]"
         role="switch"
         :aria-checked="store.enableSwipe"
         aria-label="Clear on Swipe"
         @click="toggleSwipe"
      >
         Clear on Swipe
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.renderTitles"
         aria-label="Render Titles"
         @click="toggleRenderTitles"
      >
         Render Titles
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.outlinedIcons"
         aria-label="Outline Icons"
         @click="toggleOutlinedIcons"
      >
         Outline Icons
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.rtl"
         aria-label="RTL Direction"
         @click="toggleRTL"
      >
         RTL Direction
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.emojis"
         aria-label="Emoji Icons"
         @click="toggleEmojis"
      >
         Emoji Icons
      </div>
   </div>
</template>

<style scoped>
.Controls {
   display: grid;
   gap: 10px;
   grid-auto-flow: row;
}
</style>
