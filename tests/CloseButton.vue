<script setup lang="ts">
import { Notivue, notifications, usePush } from '../src'
const push = usePush()
</script>

<template>
   <div>
      <Notivue :use="notifications" />
      <button class="Push" @click="push.success('Something good has been pushed!')">Push</button>
   </div>
</template>
