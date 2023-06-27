<script setup lang="ts">
import { useNotivue, lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } from 'notivue'

import { setTheme, store } from '@/lib/store'

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme }

const config = useNotivue()

function setConfigTheme(themeKey: string) {
   setTheme(themeKey)
   config.theme.value = themes[themeKey as keyof typeof themes]
}
</script>

<template>
   <div class="Controls">
      <div
         v-for="themeKey in Object.keys(themes)"
         :key="themeKey"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="store.theme === themeKey"
         :aria-label="themeKey"
         @click="setConfigTheme(themeKey)"
      >
         {{ themeKey.replace('Theme', '') }}
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
