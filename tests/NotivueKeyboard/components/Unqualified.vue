<script setup lang="ts">
import type { NotivueItem } from 'notivue'

const props = defineProps<{
   item: NotivueItem
}>()
</script>

<template>
   <div class="Notification Unqualified">
      <div :role="props.item.ariaRole" :aria-live="props.item.ariaLive">
         <h2>{{ props.item.title }}</h2>
         <p>{{ props.item.message }}</p>
      </div>

      <nav>
         <button @click="props.item.clear" class="DismissAction" type="button" tabindex="-1">
            Dismiss
         </button>
      </nav>
   </div>
</template>

<style scoped>
.Unqualified {
   padding: 1rem;
   background-color: white;
   border: 2px solid red;

   & * {
      margin: 0;
   }
}
</style>
