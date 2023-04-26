<script setup lang="ts">
import { Notivue, notifications, usePush } from '../src'
const push = usePush()

async function pushPromise(isReject = false) {
   const promise = push.promise('Loading')

   await new Promise((resolve) => setTimeout(resolve, 2000))

   if (isReject) {
      return promise.reject('Rejected')
   }

   promise.resolve('Resolved')
}
</script>

<template>
   <div>
      <Notivue :use="notifications" />
      <button class="Resolve" @click="() => pushPromise()">Resolve</button>
      <button class="Reject" @click="() => pushPromise(true)">Reject</button>
   </div>
</template>
