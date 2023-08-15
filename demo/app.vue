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
   type NotivueItem,
} from 'notivue'

import Nav from '@/components/nav/Nav.vue'
import Background from '@/components/shared/Background.vue'
import CustomStatic from '@/components/custom-notifications/CustomStatic.vue'
import CustomPromise from '@/components/custom-notifications/CustomPromise.vue'

import type { CustomPromiseProps, CustomProps } from '@/components/nav/NavPushCustom.vue'

const { state } = useStore()

!isSSR &&
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', state.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <ClientOnly>
      <NotivueKeyboard v-slot="{ containersTabIndex }">
         <Notivue
            :class="{ CenterOnMobile: state.centerOnMobile }"
            :containersTabIndex="containersTabIndex"
            v-slot="item"
         >
            <NotivueSwipe
               :item="item"
               :disabled="!state.enableSwipe"
               v-if="(item.props as CustomProps).isCustom"
            >
               <CustomStatic :item="item as NotivueItem<CustomProps>" />
            </NotivueSwipe>

            <NotivueSwipe
               :item="item"
               :disabled="!state.enableSwipe"
               v-else-if="(item.props as CustomPromiseProps).isFileUpload"
            >
               <CustomPromise :item="item as NotivueItem<CustomPromiseProps>" />
            </NotivueSwipe>

            <NotivueSwipe :item="item" :disabled="!state.enableSwipe" v-else>
               <Notifications
                  :item="item"
                  :theme="themes[state.theme]"
                  :icons="state.outlinedIcons ? outlinedIcons : undefined"
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
