<script setup lang="ts">
const { state } = useStore()
const { messages } = useStore()

async function asyncRefMessagePush() {
   const initialMessage = ref(state.rtl ? 'جاري تحميل الملفات...' : 'Preparing to upload files...')
   const notification = push.promise({ message: initialMessage })

   for (let n = 1; n < 4; n++) {
      await new Promise((resolve) => setTimeout(resolve, getRandomInt(1000, 2000)))
      initialMessage.value = state.rtl ? `جاري تحميل الملف ${n}/3...` : `Uploading file ${n}/3...`
   }

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(1000, 2000)))
   notification.resolve(state.rtl ? 'تم تحميل جميع الملفات!' : 'All files uploaded!')
}

async function asyncPush() {
   if (Math.random() > 0.7) return asyncRefMessagePush()

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
   <SharedButton
      @click="
         push.success({
            ...messages.success,
            onAutoClear: (item) => {
               // console.log('AutoClear!', item)
            },
            onManualClear: (item) => {
               // console.log('Manual Clear!', item)
            },
         })
      "
      text="Success"
   >
      <IconsSuccessIcon />
   </SharedButton>
   <SharedButton @click="push.error(messages.error)" text="Error">
      <IconsWarnIcon :isWarn="false" />
   </SharedButton>
   <SharedButton @click="push.warning(messages.warning)" text="Warn">
      <IconsWarnIcon isWarn />
   </SharedButton>
   <SharedButton @click="push.info(messages.info)" text="Info">
      <IconsInfoIcon />
   </SharedButton>
   <SharedButton @click="asyncPush" text="Promise">
      <IconsPromiseIcon />
   </SharedButton>
</template>
