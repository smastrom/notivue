<script setup lang="ts">
import VueIcon from '../icons/VueIcon.vue'
import Button from '../shared/Button.vue'

import profilePicture from '@/assets/profile-picture.jpg?url'

const { state, actions, computed } = useStore()

export interface CustomActionProps {
   name: string
   profilePicture: string
   isCustom: boolean
}

export interface CustomPromiseProps {
   isFileUpload: boolean
   fileName: string
}

export interface CustomSimpleProps {
   isCustomSimple: boolean
}

function resetOptions() {
   if (state.rtl) {
      push.destroyAll()
      actions.toggleRTL()
   }
   actions.setTheme('lightTheme')
}

function pushActions() {
   resetOptions()

   push.info<CustomActionProps>({
      title: 'New Message Request',
      message: `Stephanie LaGarde wants to send you a message.`,
      props: {
         name: 'Stephanie LaGarde',
         profilePicture,
         isCustom: true,
      },
      ariaRole: 'alert',
      ariaLive: 'assertive',
      duration: Infinity,
   })
}

function pushSimple() {
   resetOptions()

   push.success({
      message: `Your message has been deleted.`,
      props: {
         isCustomSimple: true,
      },
   })
}

async function pushPromise() {
   resetOptions()

   const props = { isFileUpload: true, fileName: 'excel-sheet.xlsx' }

   const promise = push.promise<CustomPromiseProps>({
      message: 'Your file is being uploaded...',
      props,
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   promise.resolve({
      message: 'Your file has been successfully uploaded.',
      props,
   })
}

function pushUsingComboKey(e: KeyboardEvent) {
   if (e.key === 'p') {
      pushActions()
   } else if (e.key === 's') {
      push.success(computed.messages.value.success)
   }
}

onMounted(() => {
   document.addEventListener('keydown', pushUsingComboKey)
})

onBeforeUnmount(() => {
   document.removeEventListener('keydown', pushUsingComboKey)
})
</script>

<template>
   <Button @click="pushActions" text="Actions">
      <VueIcon />
   </Button>
   <Button @click="pushPromise" text="Promise">
      <VueIcon />
   </Button>
   <Button @click="pushSimple" text="Simple">
      <VueIcon />
   </Button>
</template>
