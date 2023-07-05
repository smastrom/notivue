<script setup lang="ts">
import { usePush } from 'notivue'

import { getRandomInt } from '@/lib/utils'

import VueIcon from '../icons/VueIcon.vue'
import Button from '../shared/Button.vue'
import { setTheme, store, toggleRTL } from '@/lib/store'

const push = usePush()

export interface CustomProps {
   name: string
   profilePicture: string
   isCustom: boolean
}

export interface CustomPromiseProps {
   isFileUpload: boolean
   fileName: string
}

function resetOptions() {
   if (store.rtl) {
      push.destroyAll()
      toggleRTL()
   }
   setTheme('lightTheme')
}

function customPush() {
   resetOptions()

   push.info<CustomProps>({
      title: 'New Message Request',
      message: `Stephanie LaGarde wants to send you a message.`,
      props: {
         name: 'Stephanie LaGarde',
         profilePicture: '../../assets/profile-picture.png',
         isCustom: true,
      },
   })
}

async function customAsync() {
   resetOptions()

   const props = { isFileUpload: true, fileName: 'excel-sheet.xlsx' }

   const promise = push.promise<CustomPromiseProps>({
      message: 'Your file is being uploaded...',
      props,
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   promise.resolve({
      message: 'Your file has been uploaded successfully.',
      props,
   })
}
</script>

<template>
   <Button @click="customPush" text="Classic">
      <VueIcon />
   </Button>
   <Button @click="customAsync" text="Promise">
      <VueIcon />
   </Button>
</template>
