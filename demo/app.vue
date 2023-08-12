<script setup lang="ts">
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
import { isSSR } from '@/lib/utils'

import Nav from '@/components/nav/Nav.vue'
import Background from '@/components/shared/Background.vue'
import CustomStatic from '@/components/custom-notifications/CustomStatic.vue'
import CustomPromise from '@/components/custom-notifications/CustomPromise.vue'

import type { CustomPromiseProps, CustomProps } from '@/components/nav/NavPushCustom.vue'

!isSSR &&
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', store.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <ClientOnly>
      <NotivueKeyboard v-slot="{ containersTabIndex }">
         <Notivue
            :class="{ CenterOnMobile: store.centerOnMobile }"
            :containersTabIndex="containersTabIndex"
            v-slot="item"
         >
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
   </ClientOnly>

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

[data-notivue-align='bottom'] {
   --nv-root-top: 0px;
}
</style>
