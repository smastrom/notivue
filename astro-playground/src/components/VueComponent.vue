<script setup lang="ts">
import { push } from 'notivue/astro'

function pushStatic() {
   const notification = push.success({
      title: 'Vue Notification',
      message: 'Notification from Vue!',
   })

   // console.log('Vue - Push Result', notification)
}

function pushPromise() {
   const promise = push.promise({
      title: 'Loading Vue Notification...',
      message: 'Loading notification from Vue...',
   })

   setTimeout(() => {
      promise.resolve({
         title: 'Vue Notification',
         message: 'Loaded notification from Vue!',
      })
   }, 2000)
}
</script>

<template>
   <div>
      <h3>From Vue</h3>

      <button @click="pushStatic">Push</button>
      <button @click="pushPromise">Push Promise</button>

      <button @click="push.clearAll">Clear All</button>
      <button @click="push.destroyAll">Destroy All</button>
   </div>
</template>
