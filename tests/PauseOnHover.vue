<script setup lang="ts">
import { Notivue, notifications, usePush } from '../src'
const push = usePush()
</script>

<template>
   <div>
      <Notivue :use="notifications" class="Notivue__root" />
      <button class="Push" @click="push.success('Success')">Success</button>
   </div>
</template>
