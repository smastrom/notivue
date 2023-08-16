<script setup lang="ts">
import { formatDistanceToNow as toNow } from 'date-fns'

import { useNotivueKeyboard, type NotivueItem } from 'notivue'

import type { CustomActionProps } from '../nav/NavPushCustom.vue'

defineProps<{
   item: NotivueItem<CustomActionProps>
}>()

const { elementsTabIndex } = useNotivueKeyboard()
</script>

<template>
   <div class="Notification">
      <div class="Avatar">
         <img :src="item.props.profilePicture" alt="profile" class="Picture" />
         <span class="OnlineDot" />
      </div>
      <div class="Content">
         <div class="Details">
            <time>{{ toNow(item.createdAt) }} ago</time>
            <p :aria-live="item.ariaLive" :role="item.ariaRole">
               <span class="FakeLink">{{ item.props.name }}</span>
               {{ item.message.replace(item.props.name, '') }}
            </p>
         </div>
         <nav class="Buttons">
            <button
               role="button"
               @click="item.clear"
               class="Button ButtonReverse"
               :tabIndex="elementsTabIndex"
            >
               Deny
            </button>
            <button role="button" @click="item.clear" class="Button" :tabIndex="elementsTabIndex">
               Accept
            </button>
         </nav>
      </div>
   </div>
</template>

<style>
[data-notivue-container]:focus-visible {
   outline: none;
}
</style>

<style scoped>
[data-notivue-container]:focus-visible .Notification {
   outline: none;
   border-radius: 10px;
   box-shadow: var(--focus-ring-xl);
}

.Notification {
   width: 380px;
   max-width: 100%;
   display: flex;
   align-items: flex-start;
   gap: 15px;
   padding: 10px;
   background-color: #fff;
   border-radius: 10px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.Avatar {
   position: relative;
   cursor: pointer;
   transition: opacity 100ms ease-out;

   &:hover {
      opacity: 0.5;
   }
}

.OnlineDot {
   width: 1rem;
   height: 1rem;
   border-radius: 9999px;
   background-color: #4caf50;
   position: absolute;
   top: 0;
   right: 0;
   border: 2px solid #fff;
}

.Picture {
   width: 2.5rem;
   height: 2.5rem;
   border-radius: 9999px;
}

.Content {
   display: flex;
   gap: 10px;
   flex-direction: column;
   width: 100%;
}

.Details {
   display: flex;
   flex-direction: column;
   gap: 5px;
   color: #505050;
   line-height: 1.35;
   font-size: 0.9rem;

   & time {
      color: #919191;
   }
}

.FakeLink {
   text-decoration: none;
   color: inherit;
   font-weight: 700;
   transition: color 100ms ease-out;

   &:hover {
      color: var(--royal-blue);
   }
}

.Buttons {
   width: 100%;
   display: flex;
   justify-content: flex-end;
   gap: 10px;
}

.Button {
   padding: 0.3em 1em;
   border-radius: 7px;
   border: 2px solid var(--royal-blue);
   background-color: var(--royal-blue);
   -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

   color: white;
   font-size: 0.9rem;
   font-weight: 700;
   cursor: pointer;
   transition: all 100ms ease-out;

   &:hover {
      opacity: 0.5;
   }

   &:focus-visible {
      transition: none;
      outline: none;
      box-shadow: var(--focus-ring);
   }
}

.ButtonReverse {
   background-color: transparent;
   color: var(--royal-blue);

   &:hover {
      background-color: var(--royal-blue);
      color: white;
      opacity: 1;
   }
}
</style>
