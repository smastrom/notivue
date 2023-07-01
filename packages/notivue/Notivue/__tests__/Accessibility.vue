<script setup lang="ts">
import { usePush } from 'notivue'
import { Notivue } from 'notivue'

const push = usePush()
</script>

<template>
   <div>
      <Notivue v-slot="item" class="Notivue__root">
         <div>
            {{ JSON.stringify(item) }}
         </div>
      </Notivue>

      <button class="Push" @click="push.success('Success')">Success</button>
   </div>
</template>
