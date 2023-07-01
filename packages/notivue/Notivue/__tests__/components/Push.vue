<script setup lang="ts">
import { usePush, Notivue, type UserPushOptions } from 'notivue'

const push = usePush()

const props = defineProps<{
   options?: UserPushOptions
}>()

async function randomPromise() {
   const promise = push.promise(props.options ?? '')

   try {
      await new Promise((resolve, reject) =>
         setTimeout(Math.random() > 0.5 ? resolve : reject, 3000)
      )
      promise.resolve(props.options ?? '')
   } catch (error) {
      promise.reject(props.options ?? '')
   }
}
</script>

<template>
   <div>
      <Notivue v-slot="item">
         <div style="width: 300px">{{ JSON.stringify(item) }}</div>
      </Notivue>

      <button class="Success" @click="push.success(options ?? '')">Success</button>
      <button class="Error" @click="push.error(options ?? '')">Error</button>
      <button class="Warning" @click="push.warning(options ?? '')">Warning</button>
      <button class="Info" @click="push.info(options ?? '')">Info</button>
      <button class="Promise" @click="push.promise(options ?? '')">Promise</button>

      <button class="RandomPromise" @click="randomPromise">Promise</button>
   </div>
</template>
