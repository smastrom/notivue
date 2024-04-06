<script setup lang="ts">
const { state, actions, messages } = useStore()

function clearAllAndPushOne() {
   push.destroyAll()
   push.success(messages.value.success)
}

function toggleRenderTitles() {
   actions.toggleRenderTitles()
   clearAllAndPushOne()
}

function toggleRTL() {
   actions.toggleRTL()
   clearAllAndPushOne()
}

function toggleProgress() {
   actions.toggleProgress()
   clearAllAndPushOne()
}

const btnProps = {
   class: 'ButtonBase SwitchButton',
   role: 'switch',
}
</script>

<template>
   <div class="Controls">
      <button v-bind="btnProps" :aria-checked="state.hasProgress" @click="toggleProgress">
         Progress
      </button>
      <button v-bind="btnProps" :aria-checked="state.renderTitles" @click="toggleRenderTitles">
         Titles
      </button>
      <button
         v-bind="btnProps"
         :aria-checked="state.outlinedIcons"
         @click="actions.toggleOutlinedIcons"
      >
         Outlined
      </button>
      <button v-bind="btnProps" :aria-checked="state.rtl" @click="toggleRTL">RTL</button>
   </div>
</template>

<style scoped>
.Controls {
   display: grid;
   gap: 10px;
   grid-auto-flow: row;
}
</style>
