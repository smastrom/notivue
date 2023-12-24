<script setup lang="ts">
import { onMounted, onBeforeUnmount, watchEffect } from 'vue'

import {
   push,
   NotivueKeyboard,
   Notivue,
   useNotivueConfig,
   type NotivueKeyboardProps,
} from 'notivue'

import Candidate from './Candidate.vue'
import Unqualified from './Unqualified.vue'

export type CyNotivueKeyboardProps = NotivueKeyboardProps & { enqueue?: boolean; limit?: number }

const cyProps = withDefaults(defineProps<CyNotivueKeyboardProps>(), {
   handleClicks: true,
   renderAnnouncement: true,
   enqueue: false,
   limit: Infinity,
   maxAnnouncements: 2,
})

const config = useNotivueConfig()

watchEffect(() => {
   config.enqueue.value = cyProps.enqueue
   config.limit.value = cyProps.limit
})

function pushCandidate() {
   push.success({
      title: 'Candidate',
      message: 'This is a success message',
      props: {
         isCandidate: true,
      },
   })
}

function pushUnqualified() {
   push.success({
      title: 'Unqualified',
      message: 'This is an error message',
   })
}

function pushCandidateSilently(e: KeyboardEvent) {
   if (e.shiftKey && e.key === 'c') {
      pushCandidate()
   }
}

onMounted(() => {
   window.addEventListener('keydown', pushCandidateSilently)
})

onBeforeUnmount(() => {
   window.removeEventListener('keydown', pushCandidateSilently)
})
</script>

<template>
   <NotivueKeyboard
      v-slot="{ containersTabIndex }"
      :comboKey="cyProps.comboKey"
      :handleClicks="cyProps.handleClicks"
      :leaveMessage="cyProps.leaveMessage"
      :emptyMessage="cyProps.emptyMessage"
      :renderAnnouncement="cyProps.renderAnnouncement"
      :maxAnnouncements="cyProps.maxAnnouncements"
   >
      <Notivue :containersTabIndex="containersTabIndex" v-slot="item">
         <Candidate :item="item" v-if="item.props.isCandidate" />
         <Unqualified :item="item" v-else />
      </Notivue>
   </NotivueKeyboard>

   <div class="PushButtons">
      <button class="PushCandidate" @click="pushCandidate">Push Candidate</button>
      <button class="PushUnqualified" @click="pushUnqualified">Push Unqualified</button>
   </div>
</template>

<style scoped>
.PushButtons {
   position: fixed;
   bottom: 2rem;
}

.PushCandidate,
.PushUnqualified {
   margin: 1rem;
   padding: 1rem;
}
</style>
