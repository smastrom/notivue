<script setup lang="ts">
import { type ThemeNames } from 'notivue'

import { setTheme, store } from '@/lib/store'

const themeNames = [
   'lightTheme',
   'pastelTheme',
   'materialTheme',
   'darkTheme',
   'slateTheme',
] as const

function setConfigTheme(themeKey: ThemeNames) {
   setTheme(themeKey)
}
</script>

<template>
   <div class="Controls">
      <button
         v-for="themeName in themeNames"
         :key="themeName"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.theme === themeName"
         :aria-label="themeName"
         @click="setConfigTheme(themeName)"
      >
         {{ themeName.replace('Theme', '') }}
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
