<script setup lang="ts">
import { usePush } from 'notivue'
import { Notivue } from 'notivue'
import { Notifications } from 'notivue'

const push = usePush()
</script>

<template>
   <div>
      <Notivue v-slot="item">
         <Notifications :item="item" />
      </Notivue>

      <button class="Push" @click="push.success('Success')">Success</button>
   </div>
</template>
