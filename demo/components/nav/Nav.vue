<script setup lang="ts">
import { useNotivueInstance } from 'notivue'

const { isRunning } = useNotivueInstance()

let shouldDisplayNotice = ref(false)

let timeout: number

watch(isRunning, (newVal) => {
   window.clearTimeout(timeout)

   shouldDisplayNotice.value = true

   if (newVal) {
      window.setTimeout(() => {
         shouldDisplayNotice.value = false
      }, 3000)
   }
})
</script>

<template>
   <div
      class="Notice"
      v-if="shouldDisplayNotice"
      :style="{ backgroundColor: isRunning ? '#399b76' : '#d2463c' }"
      aria-live="assertive"
      role="alert"
      dir="ltr"
   >
      <template v-if="isRunning">
         Notivue is now running again. This will be dismissed shortly.</template
      >
      <template v-else>
         Notivue instance has been stopped. Restart it to create notifications.
      </template>
   </div>

   <nav dir="ltr">
      <div class="Container">
         <SharedButtonGroup name="Position">
            <NavNotivuePosition />
         </SharedButtonGroup>

         <SharedButtonGroup name="Config">
            <NavNotivueConfig />
         </SharedButtonGroup>

         <div class="DefaultComponent">
            <SharedButtonGroup name="Push 👇" isPush>
               <NavPushBuiltIn />
            </SharedButtonGroup>

            <SharedButtonGroup name="Theme">
               <NavNotificationsThemes />
            </SharedButtonGroup>

            <SharedButtonGroup name="Features">
               <NavNotificationsCustomization />
            </SharedButtonGroup>
         </div>

         <SharedButtonGroup name="Headless 👇" isPush>
            <NavPushHeadless />
         </SharedButtonGroup>

         <SharedButtonGroup name="Actions">
            <NavActions />
         </SharedButtonGroup>
      </div>
   </nav>
</template>

<style scoped>
.Notice {
   position: fixed;
   bottom: var(--nav-height);
   width: 100%;
   color: #fff;
   padding: 0.25rem 2rem;
   text-align: center;
   font-size: 0.925rem;
   line-height: normal;
   z-index: 1000;
}

nav {
   padding: 1rem 1.25rem 1.25rem 1.25rem;
   background-color: var(--nav-bg-color);
   backdrop-filter: blur(6px);
   -webkit-backdrop-filter: blur(6px);
   border-top: 1px solid var(--nav-border-color);
   display: flex;
   justify-content: center;
   width: 100%;
   z-index: 9999;
   bottom: 0;
   left: 0;
   height: var(--nav-height);
   position: fixed;
   overflow: hidden;

   & * {
      touch-action: manipulation;
   }
}

.Container {
   position: relative;
   overflow-x: auto;
   overflow-y: hidden;
   display: grid;
   grid-auto-flow: column;
   gap: 50px;
   width: 900px;
}

.DefaultComponent {
   display: grid;
   gap: 10px;
   grid-auto-flow: column;
}
</style>
