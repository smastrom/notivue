<script setup lang="ts">
import type { NotivueItem } from 'notivue'

import FriendRequestNotification, {
   type FriendRequestNotificationProps,
} from '@/components/custom-notifications/FriendRequestNotification.vue'

import UploadNotification, {
   type UploadNotificationProps,
} from '@/components/custom-notifications/UploadNotification.vue'

import SimpleNotification, {
   type SimpleNotificationProps,
} from '@/components/custom-notifications/SimpleNotification.vue'

useServerHead({
   link: ['regular', '700'].map((w) => ({
      rel: 'preload',
      href: `pt-sans-narrow-v17-latin-${w}.woff2`,
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
   })),
})

const { state } = useStore()
const config = useNotivue()

const themes = { lightTheme, pastelTheme, materialTheme, darkTheme, slateTheme } as const

!isSSR &&
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', state.maxWidth))

watch(
   () => [config.enqueue.value, config.limit.value],
   () => push.destroyAll()
)
</script>

<template>
   <NotivueKeyboard v-slot="{ containersTabIndex }">
      <Notivue
         :class="{ CenterOnMobile: state.centerOnMobile }"
         :containersTabIndex="containersTabIndex"
         v-slot="item"
      >
         <FriendRequestNotification
            v-if="item.props.isFriendRequestNotification"
            :item="item as NotivueItem<FriendRequestNotificationProps>"
         />

         <NotivueSwipe v-else :item :disabled="!state.enableSwipe">
            <UploadNotification
               v-if="item.props.isUploadNotifiation"
               :item="item as NotivueItem<UploadNotificationProps>"
            />

            <SimpleNotification
               v-else-if="item.props.isSimpleNotification"
               :item="item as NotivueItem<SimpleNotificationProps>"
            />

            <Notification
               v-else
               :item
               :theme="themes[state.theme]"
               :icons="state.outlinedIcons ? outlinedIcons : undefined"
            >
               <NotificationProgress :item v-if="state.hasProgress" />
            </Notification>
         </NotivueSwipe>
      </Notivue>
   </NotivueKeyboard>

   <SharedQueueCount />
   <Nav />
   <SharedBackground />
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
