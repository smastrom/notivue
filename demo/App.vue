<script setup lang="ts">
import { watchEffect, computed } from 'vue'
import {
   Notivue,
   notifications,
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
import { NotivueIcons } from '../src/types'

const options = {
   global: {
      icon: true,
   },
} as const

const icons: NotivueIcons = {
   ..._icons,
   warning: () => CustomIcon,
}

const _options = {
   global: {
      title: false,
   },
} as const

const emojis = computed<NotivueIcons>(() => ({
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
      :use="notifications"
      :options="store.renderTitles ? options : _options"
      :icons="store.customIcons ? emojis : store.outlineIcons ? outlineIcons : icons"
      :pauseOnHover="store.pauseOnHover"
      :position="store.position"
      :theme="themes[store.theme]"
      :class="{ CustomClass: store.centerOnMobile }"
   />
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
