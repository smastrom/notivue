<script setup lang="ts">
import {
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
import CustomActions from '@/components/custom-notifications/CustomActions.vue'
import CustomPromise from '@/components/custom-notifications/CustomPromise.vue'
import CustomSimple from '@/components/custom-notifications/CustomSimple.vue'
import QueueCount from '@/components/shared/QueueCount.vue'

import type {
   CustomPromiseProps,
   CustomActionProps,
   CustomSimpleProps,
} from '@/components/nav/NavPushCustom.vue'

const { state } = useStore()

!isSSR &&
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', state.maxWidth))

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <NotivueKeyboard v-slot="{ containersTabIndex }">
      <Notivue
         :class="{ CenterOnMobile: state.centerOnMobile }"
         :containersTabIndex="containersTabIndex"
         v-slot="item"
      >
         <CustomActions
            :item="item as NotivueItem<CustomActionProps>"
            v-if="(item.props as CustomActionProps).isCustom"
         />

         <NotivueSwipe
            :item="item"
            :disabled="!state.enableSwipe"
            v-else-if="(item.props as CustomPromiseProps).isFileUpload"
         >
            <CustomPromise :item="item as NotivueItem<CustomPromiseProps>" />
         </NotivueSwipe>

         <NotivueSwipe
            :item="item"
            :disabled="!state.enableSwipe"
            v-else-if="(item.props as CustomSimpleProps).isCustomSimple"
         >
            <CustomSimple :item="item as NotivueItem<CustomSimpleProps>" />
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

   <QueueCount />

   <ClientOnly>
      <Nav />
   </ClientOnly>

   <Background />
</template>

<style>
@media (max-width: 768px) {
   .CenterOnMobile {
      --nv-root-x-align: center;
   }
}

:root {
   --nv-root-bottom: var(--nav-height);
}

[data-notivue-align='bottom'] {
   --nv-root-top: 0px;
}
</style>
