<script setup lang="ts">
import { useNotivue, light, pastel, material, dark, slate, type Themes } from 'notivue'

import { setTheme, store } from '@/lib/store'

const themes = { light, pastel, material, dark, slate }

const themeKeys = ['light', 'pastel', 'material', 'dark', 'slate'] as const

const config = useNotivue()

function setConfigTheme(themeKey: Themes) {
   setTheme(themeKey)
   config.theme.value = themes[themeKey]
}
</script>

<template>
   <div class="Controls">
      <div
         v-for="themeKey in themeKeys"
         :key="themeKey"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.theme === themeKey"
         :aria-label="themeKey"
         @click="setConfigTheme(themeKey)"
      >
         {{ themeKey }}
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
