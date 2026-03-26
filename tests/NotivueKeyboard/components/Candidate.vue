<script setup lang="ts">
import type { NotivueItem } from 'notivue'

const props = defineProps<{
   item: NotivueItem
}>()

function onPrimaryAction() {
   props.item.clear()
}

function onSecondaryAction() {
   props.item.clear()
}
</script>

<template>
   <div class="Candidate">
      <div :role="props.item.ariaRole" :aria-live="props.item.ariaLive">
         <h2>{{ props.item.title }}</h2>
         <p>{{ props.item.message }}</p>
      </div>

      <nav>
         <button @click="onPrimaryAction" class="CandidateAction" type="button">
            Primary Action
         </button>
         <button @click="onSecondaryAction" class="CandidateAction" type="button">
            Secondary Action
         </button>
      </nav>
   </div>
</template>

<style scoped>
.Candidate {
   padding: 1rem;
   background-color: white;
   border: 2px solid green;

   & * {
      margin: 0;
   }
}
</style>
