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

import Nav from './nav/Nav.vue'
import Background from './shared/Background.vue'
import CustomStatic from './custom-notifications/CustomStatic.vue'
import CustomPromise from './custom-notifications/CustomPromise.vue'
import NotivueSwipe from '@/Notivue/NotivueSwipe.vue'

import type { CustomPromiseProps, CustomProps } from './nav/NavPushCustom.vue'

watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', store.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <Notivue :class="{ CenterOnMobile: store.centerOnMobile }" v-slot="item">
      <NotivueSwipe
         :item="item"
         :disabled="!store.enableSwipe"
         v-if="!item.props.isCustom && !item.props.isFileUpload"
      >
         <Notifications
            :item="item"
            :theme="themes[store.theme]"
            :icons="store.outlinedIcons ? outlinedIcons : undefined"
         />
      </NotivueSwipe>

      <NotivueSwipe
         :item="item"
         :disabled="!store.enableSwipe"
         exclude=".Button"
         v-if="(item.props as CustomProps).isCustom"
      >
         <CustomStatic :item="item as NotivueSlot<CustomProps>" />
      </NotivueSwipe>

      <NotivueSwipe
         :item="item"
         :disabled="!store.enableSwipe"
         exclude=".Close"
         v-if="(item.props as CustomPromiseProps).isFileUpload"
      >
         <CustomPromise :item="item as NotivueSlot<CustomPromiseProps>" />
      </NotivueSwipe>
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
