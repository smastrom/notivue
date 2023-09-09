<script setup lang="ts">
import Button from '../shared/Button.vue'
import SuccessIcon from '../icons/SuccessIcon.vue'
import PromiseIcon from '../icons/PromiseIcon.vue'
import InfoIcon from '../icons/InfoIcon.vue'
import WarnIcon from '../icons/WarnIcon.vue'

const push = usePush()
const store = useStore()

const {
   computed: { messages },
} = useStore()

async function asyncRefPush() {
   const initialMessage = ref(
      store.state.rtl ? 'جاري تحميل الملفات...' : 'Preparing to upload files...'
   )
   const notification = push.promise({ message: initialMessage })

   for (const i of [1, 2, 3, 4]) {
      await new Promise((resolve) => setTimeout(resolve, getRandomInt(1000, 2000)))
      initialMessage.value = store.state.rtl
         ? `جاري تحميل الملف ${i}/4...`
         : `Uploading file ${i}/4...`
   }

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(1000, 2000)))
   notification.resolve(store.state.rtl ? 'تم تحميل جميع الملفات!' : 'All files uploaded!')
}

async function asyncPush() {
   if (Math.random() > 0.7) return asyncRefPush()

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
