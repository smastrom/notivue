<script setup lang="ts">
const { isRunning, startInstance, stopInstance } = useNotivueInstance()
</script>

<template>
   <SharedButton @click="push.clearAll" text="Dismiss All">
      <IconsDismissIcon />
   </SharedButton>
   <SharedButton @click="push.destroyAll" text="Destroy All">
      <IconsDestroyIcon />
   </SharedButton>

   <SharedButton @click="startInstance()" text="Start Instance" :isDisabled="isRunning">
      <IconsSuccessIcon />
   </SharedButton>
   <SharedButton @click="stopInstance()" text="Stop Instance" :isDisabled="!isRunning">
      <IconsWarnIcon :isWarn="false" />
   </SharedButton>
</template>
