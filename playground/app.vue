<script setup lang="ts">
import FriendRequestNotification, {
   type FriendRequestNotificationProps,
} from '@/components/custom-notifications/FriendRequestNotification.vue'
import SimpleNotification, {
   type SimpleNotificationProps,
} from '@/components/custom-notifications/SimpleNotification.vue'
import UploadNotification, {
   type UploadNotificationProps,
} from '@/components/custom-notifications/UploadNotification.vue'

import type { NotivueItem, Position } from 'notivue'

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

if (import.meta.client) {
   watchEffect(() => document.documentElement.style.setProperty('--nv-root-width', state.maxWidth))
}

watch(
   () => [config.enqueue.value, config.limit.value],
   () => notify.destroyAll()
)

const userPosition = shallowRef<Position>(config.position.value)

if (import.meta.client) {
   const mobileMq = window.matchMedia('(max-width: 768px)')

   let syncingPosition = false

   const syncCenterOnMobile = () => {
      syncingPosition = true

      try {
         if (state.centerOnMobile && mobileMq.matches) {
            const vertical = userPosition.value.startsWith('top') ? 'top' : 'bottom'
            const centered = `${vertical}-center` as Position

            if (config.position.value !== centered) config.update({ position: centered })
         } else if (config.position.value !== userPosition.value) {
            config.update({ position: userPosition.value })
         }
      } finally {
         syncingPosition = false
      }
   }

   watch(
      () => config.position.value,
      (position) => {
         if (syncingPosition) return
         if (!(state.centerOnMobile && mobileMq.matches)) userPosition.value = position
      }
   )

   watch(() => state.centerOnMobile, syncCenterOnMobile)

   mobileMq.addEventListener('change', syncCenterOnMobile)
   onMounted(syncCenterOnMobile)
   onBeforeUnmount(() => mobileMq.removeEventListener('change', syncCenterOnMobile))
}
</script>

<template>
   <NotivueKeyboard>
      <Notivue v-slot="item">
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
:root {
   --nv-root-bottom: var(--nav-height);
}

[data-notivue-align='bottom'] {
   --nv-root-top: 0px;
}
</style>
