<script setup lang="ts">
import NavNotivueConfig from './NavNotivueConfig.vue'
import NavNotificationsThemes from './NavNotificationsThemes.vue'
import NavPushBuiltIn from './NavPushBuiltIn.vue'
import NavPushCustom from './NavPushCustom.vue'
import NavNotivuePosition from './NavNotivuePosition.vue'
import ButtonGroup from '../shared/ButtonGroup.vue'
import Button from '../shared/Button.vue'
import DismissIcon from '../icons/DismissIcon.vue'
import DestroyIcon from '../icons/DestroyIcon.vue'
import NavNotificationsCustomization from './NavNotificationsCustomization.vue'

const push = usePush()
</script>

<template>
   <nav dir="ltr">
      <div class="Container">
         <ButtonGroup name="Position">
            <NavNotivuePosition />
         </ButtonGroup>

         <ButtonGroup name="Config">
            <NavNotivueConfig />
         </ButtonGroup>

         <div class="DefaultComponent">
            <ButtonGroup name="Push 👇" isPush>
               <NavPushBuiltIn />
            </ButtonGroup>

            <ButtonGroup name="Theme">
               <NavNotificationsThemes />
            </ButtonGroup>

            <ButtonGroup name="Features">
               <NavNotificationsCustomization />
            </ButtonGroup>
         </div>

         <ButtonGroup name="Custom 👇" isPush>
            <NavPushCustom />
         </ButtonGroup>

         <ButtonGroup name="Actions">
            <Button @click="push.clearAll()" text="Dismiss All"> <DismissIcon /> </Button>
            <Button @click="push.destroyAll()" text="Destroy All">
               <DestroyIcon />
            </Button>
         </ButtonGroup>
      </div>
   </nav>
</template>

<style scoped>
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
   height: 260px;
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
