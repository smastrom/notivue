<script setup lang="ts">
import { featherProps } from '.'
</script>

<template>
   <svg v-bind="featherProps">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
   </svg>
</template>
