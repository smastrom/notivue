<script setup lang="ts">
const { state, actions, messages } = useStore()

function clearAllAndPushOne() {
   push.destroyAll()
   push.success(messages.value.success)
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
         @click="toggleRenderTitles"
      >
         Titles
      </button>
      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.outlinedIcons"
         @click="actions.toggleOutlinedIcons"
      >
         Outlined
      </button>
      <button
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.rtl"
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
