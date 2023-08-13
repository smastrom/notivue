<script setup lang="ts"></script>

<template>
   <NotivueKeyboard v-slot="{ containersTabIndex }">
      <Notivue :containersTabIndex="containersTabIndex" v-slot="item">
         <CustomStatic :item="item" />
      </Notivue>
   </NotivueKeyboard>
</template>
