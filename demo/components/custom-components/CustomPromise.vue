<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow as toNow } from 'date-fns'

import CloseIcon from '../icons/CloseIcon.vue'

import type { NotivueSlot } from 'notivue'
import type { CustomPromiseProps } from '../app/NavPushCustom.vue'

const props = defineProps<{
   item: NotivueSlot<CustomPromiseProps>
}>()

const isPromise = computed(() => props.item.type === 'promise')
</script>

<template>
   <div class="Notification">
      <div class="Header">
         <div class="Title">
            <h3>{{ item.message }}</h3>
            <button class="Close" @click="item.close" v-if="!isPromise">
               <CloseIcon />
            </button>
         </div>
      </div>

      <div class="Content">
         <div class="Extension">
            {{ item.props.fileName.split('.').pop() }}
         </div>
         <p class="FileName">{{ item.props.fileName }}</p>
      </div>

      <div class="Progress" v-if="isPromise">
         <div class="indeterminate-progress-bar">
            <div class="indeterminate-progress-bar__progress"></div>
         </div>
      </div>

      <div class="Footer" v-else>
         <time class="Time">{{ toNow(props.item.createdAt) }} ago</time>
         <p><strong>Remaining space:</strong> 302.1 GB</p>
      </div>
   </div>
</template>

<style scoped>
.Notification {
   display: flex;
   flex-direction: column;
   background-color: #fff;
   padding: 10px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
   border-radius: 10px;
   width: 360px;
   max-width: 100%;
   gap: 10px;
}

.Header {
   display: flex;
   align-items: center;
   justify-content: flex-start;
   gap: 10px;
}

.Close {
   background-color: transparent;
   border: none;
   cursor: pointer;
   padding: 0;
   margin: 0;
   outline: none;
   transition: opacity 100ms ease-out;
   padding: 5px;

   &:hover {
      opacity: 0.5;
   }

   & svg {
      width: 15px;
   }
}

.Title {
   display: flex;
   align-items: center;
   justify-content: space-between;
   width: 100%;
   gap: 10px;

   & h3 {
      letter-spacing: -0.025em;
      line-height: 1.25;
      color: #525252;
      margin: 0;
      font-size: 1rem;
   }
}

.IconContainer {
   display: flex;

   & svg {
      width: 20px;
   }
}

.Extension {
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 5px;
   background-color: #e2f7e8;
   color: #00b300;
   font-weight: 600;
   font-size: 0.7rem;
   padding: 0.5em;
   line-height: 1;
   text-transform: uppercase;
}

.FileName {
   color: #6a6a6a;
   font-size: 0.9rem;
}

.Content {
   display: flex;
   align-items: center;
   gap: 10px;
}

.Footer {
   line-height: 1.25;
   display: flex;
   align-items: center;
   justify-content: space-between;
   gap: 10px;
   font-size: 0.8rem;
   color: #525252;

   & time {
      color: #a3a3a3;
   }
}

/* Forked from: https://csslayout.io/indeterminate-progress-bar/ */

.indeterminate-progress-bar {
   /* Color */
   background-color: #e2efff;

   /* Rounded border */
   border-radius: 9999px;

   /* Size */
   height: 0.3rem;

   position: relative;
   overflow: hidden;
}

.indeterminate-progress-bar__progress {
   /* Color */
   background-color: #0076ff;

   /* Rounded border */
   border-radius: 9999px;

   /* Absolute position */
   position: absolute;
   bottom: 0;
   top: 0;
   width: 50%;

   /* Move the bar infinitely */
   animation-duration: 1.5s;
   animation-iteration-count: infinite;
   animation-name: indeterminate-progress-bar;
}

@keyframes indeterminate-progress-bar {
   from {
      transform: translateX(-300px);
   }
   to {
      transform: translateX(400px);
   }
}
</style>
