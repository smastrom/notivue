<script setup lang="ts">
import { store, setTheme } from '../store'

const themes = ['light', 'pastel', 'material', 'dark', 'slate'] as const

function capitalize(string: string) {
   return string.charAt(0).toUpperCase() + string.slice(1)
}
</script>

<template>
   <div class="Controls">
      <div
         v-for="theme in themes"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.theme === theme"
         :aria-label="theme"
         @click="setTheme(theme)"
      >
         {{ capitalize(theme) }}
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
