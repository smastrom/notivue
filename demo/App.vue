<script setup lang="ts">
import { watchEffect } from 'vue'
import { Notivue } from '../src'
import { icons as _icons } from '../src/icons'
import { defaultComponent } from '../src/defaultComponent'
import { store } from './store'
import Nav from './Nav.vue'
import Logo from './Main.vue'

const options = {
   /*    info: {
      title: 'Did you know that...',
      icon: false,
      close: false,
   },
   error: {
      title: false,
      close: false,
   }, */
} as const

const icons = {
   ..._icons,
   /*    warning: () => CustomIcon, */
}

watchEffect(() => document.documentElement.style.setProperty('--vn-root-container', store.maxWidth))
</script>

<template>
   <Notivue
      :render="defaultComponent"
      :options="options"
      :icons="icons"
      :position="store.position"
      class="CustomClass"
   />
   <Notivue id="user-1" position="bottomRight" :disabled="false" />
   <Logo />
   <Nav />
</template>

<style>
@media (max-width: 768px) {
   .CustomClass {
      --vn-root-x-align: center;
   }
}
</style>
