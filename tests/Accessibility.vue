<script setup lang="ts">
import { Notivue, notifications, usePush } from '../src'
const push = usePush()
</script>

<template>
   <div>
      <Notivue :use="notifications" class="Notivue__root" />
      <button class="Success" @click="push.success('Success')">Success</button>
      <button class="Error" @click="push.error('Error')">Error</button>
      <button class="Info" @click="push.info('Info')">Info</button>
      <button class="Warning" @click="push.warning('Warning')">Warning</button>
      <button class="Promise" @click="push.promise('Promise')">Promise</button>
   </div>
</template>
