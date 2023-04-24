<script setup lang="ts">
import { watchEffect, computed } from 'vue'
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
import CustomIcon from './icons/CustomIcon.vue'

const globalOptions = {
   duration: 20000,
   icon: true,
}

const options = {
   global: {
      ...globalOptions,
   },
} as const

const icons = {
   ..._icons,
   warning: () => CustomIcon,
}

const _options = {
   global: {
      title: false,
      ...globalOptions,
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
      :class="{ CustomClass: store.centerOnMobile }"
   />
   <Notivue id="user-1" position="bottom-right" />
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
