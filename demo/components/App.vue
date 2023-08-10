<script setup lang="ts">
import { watchEffect } from 'vue'

import {
   Notifications,
   Notivue,
   NotivueSwipe,
   NotivueKeyboard,
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

import type { CustomPromiseProps, CustomProps } from './nav/NavPushCustom.vue'

watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', store.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <NotivueKeyboard v-slot="{ tabIndex, ariaHidden }">
      <Notivue
         :class="{ CenterOnMobile: store.centerOnMobile }"
         :ariaHidden="ariaHidden"
         :tabIndex="tabIndex"
         v-slot="item"
      >
         <!-- <div class="VisuallyHidden" v-if="item.props.isNotivueKeyboard" /> -->

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
            v-else-if="(item.props as CustomPromiseProps).isFileUpload"
         >
            <CustomPromise :item="item as NotivueSlot<CustomPromiseProps>" />
         </NotivueSwipe>

         <NotivueSwipe :item="item" :disabled="!store.enableSwipe" v-else>
            <Notifications
               :item="item"
               :theme="themes[store.theme]"
               :icons="store.outlinedIcons ? outlinedIcons : undefined"
            />
         </NotivueSwipe>
      </Notivue>
   </NotivueKeyboard>

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

.VisuallyHidden {
   position: absolute;
   width: 1px;
   height: 1px;
   padding: 0;
   margin: -1px;
   overflow: hidden;
   clip: rect(0, 0, 0, 0);
   white-space: nowrap;
   border-width: 0;
}
</style>
