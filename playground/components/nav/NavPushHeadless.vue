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
      title: 'New message request',
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

   const pending = push.promise<UploadNotificationProps>({
      message: 'Uploading your file…',
      props,
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   pending.resolve({
      message: 'Your file was uploaded successfully.',
      props,
   })
}

function pushSimple() {
   resetOptions()

   push.success<SimpleNotificationProps>({
      message: 'Your message was deleted.',
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
   <SharedButton @click="pushFriendRequest" text="Friend request">
      <IconsVueIcon />
   </SharedButton>
   <SharedButton @click="pushFileUpload" text="Dynamic">
      <IconsVueIcon />
   </SharedButton>
   <SharedButton @click="pushSimple" text="Simple">
      <IconsVueIcon />
   </SharedButton>
</template>
