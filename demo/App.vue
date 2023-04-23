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

const _options = {
   success: {
      title: false,
   },
   warning: {
      title: false,
   },
   info: {
      title: false,
   },
   error: {
      title: false,
   },
   promise: {
      title: false,
   },
   'promise-resolve': {
      title: false,
   },
   'promise-reject': {
      title: false,
   },
}

const emojis = {
   success: '✅',
   error: '⛔️',
   warning: '🤌',
   info: '❔',
   promise: '🌀',
   'promise-resolve': '✅',
   'promise-reject': '⛔️',
   close: 'Close',
}

const icons = {
   ..._icons,
   /*    warning: () => CustomIcon, */
}

watchEffect(() => document.documentElement.style.setProperty('--vn-root-container', store.maxWidth))
</script>

<template>
   <Notivue
      :use="defaultComponent"
      :options="store.renderTitles ? options : _options"
      :icons="store.customIcons ? emojis : icons"
      :pauseOnHover="store.pauseOnHover"
      :position="store.position"
      :disabled="store.isDisabled"
      class="CustomClass"
   />
   <Notivue id="user-1" position="bottom-right" :disabled="false" />
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
