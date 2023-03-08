<script setup lang="ts">
const props = defineProps<{
   name: string
}>()
</script>

<template>
   <fieldset>
      <legend>{{ props.name }}</legend>

      <div class="Nav">
         <slot />
      </div>
   </fieldset>
</template>

<style scoped>
fieldset {
   border: none;
   padding: 0;
   margin: 0;
}

legend {
   white-space: nowrap;
   font-size: 0.925rem;
   text-transform: uppercase;
   font-weight: 700;
   color: #6b7a90;
   font-family: 'PT Sans Narrow', Avenir, Helvetica, Arial, sans-serif;
   margin-bottom: 10px;
}

.Nav {
   display: grid;
   grid-template-columns: 1fr;
   gap: 10px;
}
</style>
