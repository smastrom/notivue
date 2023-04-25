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

const globalOptions = {
   // duration: 2000,
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

const animations = {
   enter: 'SlideIn',
   leave: 'SlideOut',
   clearAll: 'Fade',
}

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
      :animations="animations"
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

.SlideIn {
   animation: SlideInKF 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.SlideOut {
   animation: SlideOutKF 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.Fade {
   animation: FadeKF 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes SlideInKF {
   0% {
      transform: translate3d(300px, 0, 0);
      opacity: 0;
   }
   100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
   }
}

@keyframes SlideOutKF {
   0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
   }
   100% {
      transform: translate3d(150px, 0, 0);
      opacity: 0;
   }
}

@keyframes FadeKF {
   0% {
      opacity: 1;
   }
   100% {
      opacity: 0;
   }
}
</style>
