<script setup lang="ts">
import { watchEffect } from 'vue'

import { Notifications, Notivue, NotivueSlot } from 'notivue'
import { store } from '@/lib/store'

import Nav from './app/Nav.vue'
import Background from './app/Background.vue'
import CustomClassic from './custom-components/CustomClassic.vue'
import CustomPromise from './custom-components/CustomPromise.vue'

import type { CustomPromiseProps, CustomProps } from './app/NavPushCustom.vue'

watchEffect(() => document.documentElement.style.setProperty('--nv-root-container', store.maxWidth))
</script>

<template>
   <Notivue class="CustomClass" v-slot="item">
      <Notifications v-bind="{ item }" v-if="!item.props.isCustom && !item.props.isFileUpload" />

      <CustomClassic
         v-if="(item.props as CustomProps).isCustom"
         :item="item as NotivueSlot<CustomProps>"
      />

      <CustomPromise
         v-if="(item.props as CustomPromiseProps).isFileUpload"
         :item="item as NotivueSlot<CustomPromiseProps>"
      />
   </Notivue>

   <Background />
   <Nav />
</template>

<style>
@media (max-width: 768px) {
   .CustomClass {
      --nv-root-x-align: center;
   }
}
</style>
