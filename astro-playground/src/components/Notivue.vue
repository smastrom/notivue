<script setup lang="ts">
import { Notivue, NotificationSwipe, Notification } from 'notivue/astro'
</script>

<template>
   <Notivue v-slot="item">
      <NotificationSwipe :item="item">
         <Notification :item="item" />
      </NotificationSwipe>
   </Notivue>
</template>
