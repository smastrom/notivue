<script setup lang="ts">
import { usePush, Notivue, type UserPushOptions } from 'notivue'

const push = usePush()

const props = defineProps<{
   options?: UserPushOptions
   class?: string
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
      <Notivue v-slot="item" class="Root">
         <div style="width: 300px">{{ JSON.stringify(item) }}</div>
         <button class="ClearButton" @click="item.clear">Clear</button>
         <button class="DestroyButton" @click="item.destroy">Destroy</button>
      </Notivue>

      <button class="Success" @click="push.success(options ?? '')">Success</button>
      <button class="Error" @click="push.error(options ?? '')">Error</button>
      <button class="Warning" @click="push.warning(options ?? '')">Warning</button>
      <button class="Info" @click="push.info(options ?? '')">Info</button>
      <button class="Promise" @click="push.promise(options ?? '')">Promise</button>

      <button class="RandomPromise" @click="randomPromise">Promise</button>
   </div>
</template>
