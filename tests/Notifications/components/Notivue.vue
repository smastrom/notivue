<script setup lang="ts">
import {
   usePush,
   Notivue,
   Notifications,
   NotivueIcons,
   NotivueTheme,
   type PushOptions,
} from 'notivue'

const push = usePush()

export interface CyNotificationsProps {
   options?: PushOptions
   icons?: NotivueIcons
   theme?: NotivueTheme
}

const cyProps = defineProps<CyNotificationsProps>()
</script>

<template>
   <div>
      <Notivue v-slot="item">
         <Notifications :item="item" :icons="cyProps.icons" :theme="cyProps.theme" />
      </Notivue>

      <button class="Success" @click="push.success(cyProps.options ?? {})">Success</button>
   </div>
</template>
