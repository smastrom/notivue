<script setup lang="ts">
import {
   lightTheme,
   pastelTheme,
   materialTheme,
   darkTheme,
   slateTheme,
   outlinedIcons,
} from 'notivue'

import Nav from '@/components/nav/Nav.vue'
import Background from '@/components/shared/Background.vue'
import CustomActions from '@/components/custom-notifications/CustomActions.vue'
import CustomPromise from '@/components/custom-notifications/CustomPromise.vue'
import CustomSimple from '@/components/custom-notifications/CustomSimple.vue'
import QueueCount from '@/components/shared/QueueCount.vue'

const { state } = useStore()

const config = useNotivue()

!isSSR &&
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', state.maxWidth))

watch(
   () => [config.enqueue.value, config.limit.value],
   () => push.destroyAll()
)

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const
</script>

<template>
   <NotivueKeyboard v-slot="{ containersTabIndex }">
      <Notivue
         :class="{ CenterOnMobile: state.centerOnMobile }"
         :containersTabIndex="containersTabIndex"
         v-slot="item"
      >
         <CustomActions :item="item" v-if="item.props.isCustom" />

         <NotivueSwipe
            :item="item"
            :disabled="!state.enableSwipe"
            v-else-if="item.props.isFileUpload"
         >
            <CustomPromise :item="item" />
         </NotivueSwipe>

         <NotivueSwipe
            :item="item"
            :disabled="!state.enableSwipe"
            v-else-if="item.props.isCustomSimple"
         >
            <CustomSimple :item="item" />
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
   <Nav />
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
