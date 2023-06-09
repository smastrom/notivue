<script setup lang="ts">
import { watchEffect } from 'vue'

import {
   Notifications,
   Notivue,
   lightTheme,
   pastelTheme,
   materialTheme,
   darkTheme,
   slateTheme,
   outlinedIcons,
   type NotivueSlot,
} from 'notivue'
import { store } from '@/lib/store'

import Nav from './app/Nav.vue'
import Background from './app/Background.vue'
import CustomClassic from './custom-components/CustomClassic.vue'
import CustomPromise from './custom-components/CustomPromise.vue'

import type { CustomPromiseProps, CustomProps } from './app/NavPushCustom.vue'

watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', store.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const

const emojiIcons = {
   success: '✅',
   error: '⛔️',
   warning: '🤌',
   info: '💡',
   promise: '🌀',
   'promise-resolve': '✅',
   'promise-reject': '⛔️',
   close: store.rtl ? 'إغلاق' : 'Close',
}
</script>

<template>
   <Notivue :class="store.centerOnMobile ? 'CenterOnMobile' : ''" v-slot="item">
      <Notifications
         v-if="!item.props.isCustom && !item.props.isFileUpload"
         :item="item"
         :theme="themes[store.theme]"
         :icons="store.outlinedIcons ? outlinedIcons : store.emojis ? emojiIcons : undefined"
      />

      <CustomClassic
         v-if="(item.props as CustomProps).isCustom"
         :item="item as NotivueSlot<CustomProps>"
      />

      <CustomPromise
         v-if="(item.props as CustomPromiseProps).isFileUpload"
         :item="item as NotivueSlot<CustomPromiseProps>"
      />
   </Notivue>

   <Background />
   <Nav />
</template>

<style>
@media (max-width: 768px) {
   .CenterOnMobile {
      --nv-root-x-align: center;
   }
}

:root {
   --nv-root-bottom: 260px;
}

[data-notivue-top='false'] {
   --nv-root-top: 0px;
}
</style>
