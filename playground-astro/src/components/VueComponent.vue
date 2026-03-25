<script setup lang="ts">
import { notify } from 'notivue/astro'

function notifyStatic() {
   notify.success({
      title: 'Vue Notification',
      message: 'Notification from Vue!',
   })
}

function notifyDynamic() {
   const notification = notify.loading({
      title: 'Updating…',
      message: 'This dynamic notification is still updating.',
   })

   setTimeout(() => {
      notification.success({
         title: 'Vue notification',
         message: 'Update finished — notification from Vue.',
      })
   }, 2000)
}
</script>

<template>
   <div>
      <h3>From Vue</h3>

      <button @click="notifyStatic">Push</button>
      <button @click="notifyDynamic">Push dynamic</button>
      <button @click="notify.clearAll">Clear All</button>
      <button @click="notify.destroyAll">Destroy All</button>
   </div>
</template>
