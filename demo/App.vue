<script setup lang="ts">
import { watchEffect } from 'vue'
import {
   Notivue,
   notification,
   icons as _icons,
   outlineIcons,
   light,
   pastel,
   material,
   dark,
   slate,
} from '../src'
import { store } from './store'
import Nav from './components/Nav.vue'
import Logo from './components/Background.vue'
import { computed } from 'vue'

const globalOptions = {
   global: {
      duration: 20000,
      icon: false,
   },
}

const options = {
   ...globalOptions,
} as const

const icons = {
   ..._icons,
   /*    warning: () => CustomIcon, */
}

const _options = {
   ...globalOptions,
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

const emojis = computed(() => ({
   success: '✅',
   error: '⛔️',
   warning: '🤌',
   info: '💡',
   promise: '🌀',
   'promise-resolve': '✅',
   'promise-reject': '⛔️',
   close: store.rtl ? 'إغلاق' : 'Close',
}))

const themes = {
   light,
   pastel,
   material,
   dark,
   slate,
} as const

watchEffect(() => document.documentElement.style.setProperty('--nv-root-container', store.maxWidth))
</script>

<template>
   <Notivue
      :use="notification"
      :options="store.renderTitles ? options : _options"
      :icons="store.customIcons ? emojis : store.outlineIcons ? outlineIcons : icons"
      :pauseOnHover="store.pauseOnHover"
      :position="store.position"
      :theme="themes[store.theme]"
      :disabled="store.isDisabled"
      :class="{ CustomClass: store.centerOnMobile }"
   />
   <Notivue id="user-1" position="bottom-right" :disabled="false" />
   <Logo />
   <Nav />
</template>

<style>
@media (max-width: 768px) {
   .CustomClass {
      --nv-root-x-align: center;
   }
}
</style>
