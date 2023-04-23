<script setup lang="ts">
const props = withDefaults(
   defineProps<{
      name: string
      isPush: boolean
   }>(),
   {
      isPush: false,
   }
)
</script>

<template>
   <fieldset>
      <legend :class="{ BounceAnim: props.isPush }">{{ props.name }}</legend>

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
   color: var(--legend-title-color);
   font-family: 'PT Sans Narrow', Avenir, Helvetica, Arial, sans-serif;
   margin-bottom: 10px;
}

.Nav {
   display: grid;
   grid-template-columns: 1fr;
   gap: 10px;
}
</style>
