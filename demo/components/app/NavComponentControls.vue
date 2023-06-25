<script setup lang="ts">
import {
   store,
   toggleRenderTitles as toggleInternalRenderTitles,
   toggleOutlineIcons as toggleInternalOutlineIcons,
   toggleEmojis as toggleInternalEmojis,
   toggleRTL as toggleInternalRTL,
   messages,
} from '../../lib/store'
import { filledIcons, outlineIcons, useConfig, usePush } from '../../../src'
import { isMobile } from '../../lib/utils'

const config = useConfig()
const push = usePush()

function togglePauseOnHover() {
   config.pauseOnHover.value = !config.pauseOnHover.value
}

function togglePauseOnTouch() {
   config.pauseOnTouch.value = !config.pauseOnTouch.value
}

function toggleOutlineIcons() {
   toggleInternalOutlineIcons()
   if (store.emojis) toggleInternalEmojis()

   config.icons.value = store.outlineIcons ? outlineIcons : filledIcons
}

function toggleEmojis() {
   toggleInternalEmojis()

   if (store.emojis) {
      config.icons.value = {
         success: '✅',
         error: '⛔️',
         warning: '🤌',
         info: '💡',
         promise: '🌀',
         'promise-resolve': '✅',
         'promise-reject': '⛔️',
         close: store.rtl ? 'إغلاق' : 'Close',
      }
   } else {
      config.icons.value = store.outlineIcons ? outlineIcons : filledIcons
   }
}

async function toggleRenderTitles() {
   toggleInternalRenderTitles()

   push.destroyAll()
   push.success(messages.value.success)
}

function toggleRTL() {
   toggleInternalRTL()

   push.destroyAll()
   push.success(messages.value.success)
}
</script>

<template>
   <div class="Controls">
      <div
         v-if="isMobile"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="config.pauseOnHover.value"
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
         :aria-checked="store.outlineIcons"
         aria-label="Outline Icons"
         @click="toggleOutlineIcons"
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
         aria-label="Use Emojis"
         @click="toggleEmojis"
      >
         Use Emojis
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
