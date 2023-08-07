<script setup lang="ts">
import { usePush } from 'notivue'

import {
   store,
   toggleRenderTitles as _toggleRenderTitles,
   toggleRTL as _toggleRTL,
   toggleOutlinedIcons,
   messages,
} from '@/lib/store'

const push = usePush()

function clearAllAndPushOne() {
   push.destroyAll()
   push.success(messages.value.success)
}

async function toggleRenderTitles() {
   _toggleRenderTitles()
   clearAllAndPushOne()
}

function toggleRTL() {
   _toggleRTL()
   clearAllAndPushOne()
}
</script>

<template>
   <div class="Controls">
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.renderTitles"
         aria-label="Render Titles"
         @click="toggleRenderTitles"
      >
         Titles
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.outlinedIcons"
         aria-label="Outline Icons"
         @click="toggleOutlinedIcons"
      >
         Outlined
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.rtl"
         aria-label="RTL Direction"
         @click="toggleRTL"
      >
         RTL
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
