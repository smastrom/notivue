<script setup lang="ts">
import {
   push,
   Notivue,
   Notifications,
   NotificationProgress,
   NotivueIcons,
   NotivueTheme,
   type PushOptions,
} from 'notivue'

export interface CyNotificationsProps {
   options?: PushOptions
   icons?: NotivueIcons
   theme?: NotivueTheme
   hideClose?: boolean
}

const cyProps = defineProps<CyNotificationsProps>()
</script>

<template>
   <div>
      <Notivue v-slot="item">
         <Notifications
            :item
            :icons="cyProps.icons"
            :theme="cyProps.theme"
            :hideClose="cyProps.hideClose"
         >
            <NotificationProgress :item />
         </Notifications>
      </Notivue>

      <button class="Success" @click="push.success(cyProps.options ?? {})">Success</button>
      <button class="Info" @click="push.info(cyProps.options ?? {})">Info</button>
      <button class="Warning" @click="push.warning(cyProps.options ?? {})">Warning</button>
      <button class="Error" @click="push.error(cyProps.options ?? {})">Error</button>
   </div>
</template>
