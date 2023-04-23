<script setup lang="ts">
import { store, setPauseOnHover, setRenderTiles, setCustomIcons } from './store'
</script>

<template>
   <div class="Controls">
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.pauseOnHover"
         aria-label="Pause on Hover"
         @click="setPauseOnHover"
      >
         Pause on Hover
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.renderTitles"
         aria-label="Render Titles"
         @click="setRenderTiles"
      >
         Render Titles
      </div>
      <div
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.customIcons"
         aria-label="Use Emojis"
         @click="setCustomIcons"
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
