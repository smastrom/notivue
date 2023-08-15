<script setup lang="ts">
import { usePush } from 'notivue'

import Button from '../shared/Button.vue'
import SuccessIcon from '../icons/SuccessIcon.vue'
import PromiseIcon from '../icons/PromiseIcon.vue'
import InfoIcon from '../icons/InfoIcon.vue'
import WarnIcon from '../icons/WarnIcon.vue'

const push = usePush()

const {
   computed: { messages },
} = useStore()

async function asyncPush() {
   const promise = push.promise(messages.value.promise)

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   if (Math.random() > 0.5) {
      promise.resolve(messages.value.success)
   } else {
      promise.reject(messages.value.error)
   }
}
</script>

<template>
   <Button @click="push.success(messages.success)" text="Success">
      <SuccessIcon />
   </Button>
   <Button @click="push.error(messages.error)" text="Error">
      <WarnIcon :isWarn="false" />
   </Button>
   <Button @click="push.warning(messages.warning)" text="Warn">
      <WarnIcon :isWarn="true" />
   </Button>
   <Button @click="push.info(messages.info)" text="Info">
      <InfoIcon />
   </Button>
   <Button @click="asyncPush" text="Promise">
      <PromiseIcon />
   </Button>
</template>
