<script setup lang="ts">
import profilePicture from '@/assets/profile-picture.jpg?url'

import type { UploadNotificationProps } from '@/components/custom-notifications/UploadNotification.vue'
import type { FriendRequestNotificationProps } from '@/components/custom-notifications/FriendRequestNotification.vue'
import type { SimpleNotificationProps } from '@/components/custom-notifications/SimpleNotification.vue'

const { state, actions, messages } = useStore()

function resetOptions() {
   if (state.rtl) {
      push.destroyAll()
      actions.toggleRTL()
   }
   actions.setTheme('lightTheme')
}

function pushFriendRequest() {
   resetOptions()

   push.info<FriendRequestNotificationProps>({
      title: 'New Message Request',
      message: `Stephanie LaGarde wants to send you a message.`,
      props: {
         name: 'Stephanie LaGarde',
         profilePicture,
         isFriendRequestNotification: true,
      },
      ariaRole: 'alert',
      ariaLive: 'assertive',
      duration: Infinity,
   })
}

async function pushFileUpload() {
   resetOptions()

   const props = { isUploadNotifiation: true, fileName: 'excel-sheet.xlsx' }

   const promise = push.promise<UploadNotificationProps>({
      message: 'Your file is being uploaded...',
      props,
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   promise.resolve({
      message: 'Your file has been successfully uploaded.',
      props,
   })
}

function pushSimple() {
   resetOptions()

   push.success<SimpleNotificationProps>({
      message: `Your message has been deleted.`,
      props: {
         isSimpleNotification: true,
      },
   })
}

function pushUsingComboKey(e: KeyboardEvent) {
   if (e.key === 'p') {
      pushFriendRequest()
   } else if (e.key === 's') {
      push.success(messages.value.success)
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
   <SharedButton @click="pushFriendRequest" text="Actions">
      <IconsVueIcon />
   </SharedButton>
   <SharedButton @click="pushFileUpload" text="Promise">
      <IconsVueIcon />
   </SharedButton>
   <SharedButton @click="pushSimple" text="Simple">
      <IconsVueIcon />
   </SharedButton>
</template>
