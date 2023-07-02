<script setup lang="ts">
import {
   usePush,
   Notivue,
   Notifications,
   NotivueIcons,
   NotivueTheme,
   type UserPushOptions,
} from 'notivue'

const push = usePush()

const cyProps = defineProps<{
   options?: UserPushOptions
   icons?: NotivueIcons
   theme?: NotivueTheme
}>()
</script>

<template>
   <div>
      <Notivue v-slot="item">
         <Notifications :item="item" :icons="icons" :theme="theme" />
      </Notivue>

      <button class="Success" @click="push.success(options ?? {})">Success</button>
   </div>
</template>
