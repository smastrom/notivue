<script setup lang="ts">
import { push } from 'notivue/astro'

function pushStatic() {
   push.success({
      title: 'Vue Notification',
      message: 'Notification from Vue!',
   })
}

function pushDynamic() {
   const pending = push.promise({
      title: 'Updating…',
      message: 'This dynamic notification is still updating.',
   })

   setTimeout(() => {
      pending.resolve({
         title: 'Vue notification',
         message: 'Update finished — notification from Vue.',
      })
   }, 2000)
}
</script>

<template>
   <div>
      <h3>From Vue</h3>

      <button @click="pushStatic">Push</button>
      <button @click="pushDynamic">Push dynamic</button>
      <button @click="push.clearAll">Clear All</button>
      <button @click="push.destroyAll">Destroy All</button>
   </div>
</template>
