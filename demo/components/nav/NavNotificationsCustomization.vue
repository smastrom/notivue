<script setup lang="ts">
import { usePush } from 'notivue'

const push = usePush()

const { state, actions, computed } = useStore()

function clearAllAndPushOne() {
   push.destroyAll()
   push.success(computed.messages.value.success)
}

async function toggleRenderTitles() {
   actions.toggleRenderTitles()
   clearAllAndPushOne()
}

function toggleRTL() {
   actions.toggleRTL()
   clearAllAndPushOne()
}
</script>

<template>
   <div class="Controls">
      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.renderTitles"
         aria-label="Render Titles"
         @click="toggleRenderTitles"
      >
         Titles
      </button>
      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.outlinedIcons"
         aria-label="Outline Icons"
         @click="actions.toggleOutlinedIcons"
      >
         Outlined
      </button>
      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.rtl"
         aria-label="RTL Direction"
         @click="toggleRTL"
      >
         RTL
      </button>
   </div>
</template>

<style scoped>
.Controls {
   display: grid;
   gap: 10px;
   grid-auto-flow: row;
}
</style>
utils/store
