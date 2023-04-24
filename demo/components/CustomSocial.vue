<script setup lang="ts">
import { _PushOptions } from '../../src/types'
import { store } from '../store'

const props = defineProps<{
   name: string
   profileUrl: string
   message: string
   timeAgo: string
   close: () => void
}>()
</script>

<template>
   <div class="Notification">
      <div class="Avatar">
         <img src="../assets/profile-picture.png" alt="profile" class="Picture" />
         <span class="OnlineDot" />
      </div>
      <div class="Content">
         <div class="Details">
            <time>{{ props.timeAgo }}</time>
            <p>
               <a href="#">{{ name }}</a> {{ message }}
            </p>
         </div>
         <nav class="Buttons">
            <button @click="props.close" class="Button ButtonReverse">
               {{ store.rtl ? 'ينكر' : 'Deny' }}
            </button>
            <button @click="props.close" class="Button">
               {{ store.rtl ? 'يقبل' : 'Accept' }}
            </button>
         </nav>
      </div>
   </div>
</template>

<style scoped>
.Notification {
   --blue-color: #438bff;
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

   & a {
      text-decoration: none;
      color: inherit;
      font-weight: 700;
      transition: color 100ms ease-out;

      &:hover {
         color: var(--blue-color);
      }
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
   border: 2px solid var(--blue-color);
   background-color: var(--blue-color);

   color: white;
   font-size: 0.9rem;
   font-weight: 700;
   cursor: pointer;
   transition: all 100ms ease-out;

   &:hover {
      opacity: 0.5;
   }
}

.ButtonReverse {
   background-color: transparent;
   color: var(--blue-color);

   &:hover {
      background-color: var(--blue-color);
      color: white;
      opacity: 1;
   }
}
</style>
