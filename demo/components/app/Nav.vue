<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { usePush } from 'notivue'

import NavComponentControls from './NavComponentControls.vue'
import NavThemesControls from './NavThemesControls.vue'
import NavPushClassic from './NavPushClassic.vue'
import NavPushCustom from './NavPushCustom.vue'
import NavPositionControls from './NavPositionControls.vue'
import ButtonGroup from '../shared/ButtonGroup.vue'
import Button from '../shared/Button.vue'
import DismissIcon from '../icons/DismissIcon.vue'
import DestroyIcon from '../icons/DestroyIcon.vue'

const push = usePush()

const navRef = ref<HTMLElement | null>(null)

onMounted(() => {
   getNavHeight()
   window.addEventListener('resize', getNavHeight, { passive: true })
})

onBeforeUnmount(() => {
   window.removeEventListener('resize', getNavHeight)
})

function getNavHeight() {
   document.documentElement.style.setProperty(
      '--nv-root-bottom',
      `${(navRef.value?.clientHeight ?? 0) + 10}px`
   )
}
</script>

<template>
   <nav dir="ltr" ref="navRef">
      <div class="Container">
         <ButtonGroup name="Position">
            <NavPositionControls />
         </ButtonGroup>

         <ButtonGroup name="Controls">
            <NavComponentControls />
         </ButtonGroup>

         <div class="DefaultComponent">
            <ButtonGroup name="Push 👇" isPush>
               <NavPushClassic />
            </ButtonGroup>

            <ButtonGroup name="Theme">
               <NavThemesControls />
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
   z-index: 2147483647;
   bottom: 0;
   left: 0;
   position: fixed;
   overflow: hidden;

   & * {
      touch-action: manipulation;
   }
}

.Container {
   position: relative;
   overflow: auto;
   width: max-content;
   display: grid;
   grid-auto-flow: column;
   gap: 50px;
}

.DefaultComponent {
   display: grid;
   gap: 10px;
   grid-auto-flow: column;
}
</style>
