<script setup lang="ts">
defineProps<{
   message?: string
   title?: string | boolean
   type?: string
   close: () => void
   avatarUrl?: string
   name?: string
}>()
</script>

<template>
   <div style="display: block">
      <div class="Container">
         <p>{{ message }}</p>
         <button @click="close">Dismiss</button>
         <div v-if="avatarUrl">
            <img :src="avatarUrl" class="Avatar" />
         </div>
         <div v-if="name">
            <p>{{ name }}</p>
         </div>
      </div>
   </div>
</template>

<style scoped>
.Container {
   padding: 10px;
   width: 500px;
   color: black;
   background-color: white;
   border-radius: 5px;
   display: grid;
   pointer-events: auto;
   grid-template-columns: auto 100px;
   margin: 0;
   box-sizing: border-box;

   & > p {
      margin: 0 !important;
      padding: 0 !important;
   }
}

.Avatar {
   width: 100px;
   height: 100px;
   object-fit: cover;
   border-radius: 50%;
}
</style>
