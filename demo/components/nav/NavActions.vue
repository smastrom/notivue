<script setup lang="ts">
const { entries } = useNotifications()

const { isRunning, startInstance, stopInstance } = useNotivueInstance()
</script>

<template>
   <SharedButton
      @click="push.clearAll()"
      text="Dismiss All"
      :isDisabled="entries.length === 0"
      :key="entries.length"
   >
      <IconsDismissIcon />
   </SharedButton>
   <SharedButton
      @click="push.destroyAll()"
      text="Destroy All"
      :isDisabled="entries.length === 0"
      :key="entries.length"
   >
      <IconsDestroyIcon />
   </SharedButton>

   <SharedButton @click="startInstance()" text="Start Instance" :isDisabled="isRunning">
      <IconsSuccessIcon />
   </SharedButton>
   <SharedButton @click="stopInstance()" text="Stop Instance" :isDisabled="!isRunning">
      <IconsWarnIcon :isWarn="false" />
   </SharedButton>
</template>
