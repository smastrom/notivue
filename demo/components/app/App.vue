<script setup lang="ts">
import { watchEffect } from 'vue'

import { Notifications, Notivue } from '../../../src'
import { store } from '../../lib/store'

import Nav from './Nav.vue'
import Background from './Background.vue'
import CustomClassic from '../custom-components/CustomClassic.vue'
import CustomPromise from '../custom-components/CustomPromise.vue'

watchEffect(() => document.documentElement.style.setProperty('--nv-root-container', store.maxWidth))
</script>

<template>
   <Notivue class="CustomClass" v-slot="item">
      <Notifications
         v-bind="{ item }"
         v-if="item.type !== 'custom-classic' && !item.props.isFileUpload"
      />

      <CustomClassic
         v-if="item.type === 'custom-classic'"
         :message="item.message"
         :createdAt="item.createdAt"
         :close="item.clear"
         :profilePicture="item.props.profilePicture"
         :name="item.props.name"
      />

      <CustomPromise
         v-if="item.props.isFileUpload"
         :message="item.message"
         :createdAt="item.createdAt"
         :close="item.clear"
         :type="item.type"
         :fileName="item.props.fileName"
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
