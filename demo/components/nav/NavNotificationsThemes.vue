<script setup lang="ts">
import type { ThemeNames } from 'notivue'

const themeNames = [
   'lightTheme',
   'pastelTheme',
   'materialTheme',
   'darkTheme',
   'slateTheme',
] as const

const { state, actions } = useStore()

function setConfigTheme(themeKey: ThemeNames) {
   actions.setTheme(themeKey)
}
</script>

<template>
   <div class="Controls">
      <button
         v-for="themeName in themeNames"
         :key="themeName"
         class="ButtonBase SwitchButton"
         role="switch"
         :aria-checked="state.theme === themeName"
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
utils/store
