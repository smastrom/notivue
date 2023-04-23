<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { usePush } from '../src/usePush'
import { getRandomInt } from './utils'
import ButtonGroup from './ButtonGroup.vue'
import PositionControls from './PositionControls.vue'
import Button from './Button.vue'
import SuccessIcon from './icons/Success.vue'
import VueIcon from './icons/Vue.vue'
import PromiseIcon from './icons/Promise.vue'
import Info from './icons/Info.vue'
import Warn from './icons/Warn.vue'
import Dismiss from './icons/Dismiss.vue'
import Destroy from './icons/Destroy.vue'
import Controls from './ComponentControls.vue'
import type { _PushOptions } from '../src/types'
import ThemesControls from './ThemesControls.vue'

const navRef = ref<HTMLElement | null>(null)

const push = usePush()

async function asyncPush() {
   const ayncNotify = push.promise("We're sending your message. This will take a moment or two...")

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   if (Math.random() > 0.5) {
      ayncNotify.reject({ message: 'Promise rejected!' })
   } else {
      ayncNotify.resolve({ message: 'Promise successfully resolved! '.repeat(4) })
   }
}

function getNavHeight() {
   document.documentElement.style.setProperty(
      '--vn-root-bottom',
      `${(navRef.value?.clientHeight ?? 0) + 10}px`
   )
}

onMounted(() => {
   getNavHeight()

   window.addEventListener('resize', getNavHeight, { passive: true })
})

onBeforeUnmount(() => {
   window.removeEventListener('resize', getNavHeight)
})

function customPush() {
   /*    push({
      message: 'Custom',
      render: {
         component: markRaw(Custom),
         props: ({ notivueProps }) => ({
            ...notivueProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   }) */
   /*    push({
      message: 'Custom',
      render: {
         component: markRaw(Custom),
         props: ({ notivueProps }) => ({}),
      },
   }) */
}

async function customAsync() {
   const promise = push.promise({
      message: 'Async',
      render: {
         component: () => Custom,
         props: ({ notivueProps }) => ({
            ...notivueProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            nameSurname: 'John Doe',
         }),
      },
   })

   await new Promise((resolve) => setTimeout(resolve, 3000))

   promise.resolve({
      message: 'Async resolved',
      render: {
         component: () => Custom,
         props: ({ notivueProps, prevProps }) => ({
            ...notivueProps,
            ...prevProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   })

   /*    promise.reject({
      message: 'Async resolved',
      render: {
         component: markRaw(Custom),
         props: ({ notivueProps }) => ({
            ...notivueProps,
         }),
      },
   })

   promise.reject({
      message: 'Async resolved',
      render: {
         component: markRaw(Custom),
         props: ({ notivueProps }) => ({}),
      },
   }) */
}
</script>

<template>
   <nav dir="ltr" ref="navRef">
      <div class="Container">
         <ButtonGroup name="Position">
            <PositionControls />
         </ButtonGroup>

         <ButtonGroup name="Controls">
            <Controls />
         </ButtonGroup>

         <div class="DefaultComponent">
            <ButtonGroup name="Notification">
               <Button
                  @click="$push('Your message has been successfully sent. Please.')"
                  text="Success"
               >
                  <SuccessIcon />
               </Button>
               <Button
                  @click="$push.error('Your message has been successfully sent. Please.')"
                  text="Error"
               >
                  <Warn :isWarn="false" />
               </Button>
               <Button
                  @click="$push.warning('Your message has been successfully sent. Please.')"
                  text="Warn"
               >
                  <Warn :isWarn="true" />
               </Button>
               <Button
                  @click="$push.info('Your message has been successfully sent. Please.')"
                  text="Info"
               >
                  <Info />
               </Button>
               <Button @click="asyncPush" text="Promise">
                  <PromiseIcon />
               </Button>
            </ButtonGroup>

            <ButtonGroup name="Theme">
               <ThemesControls />
            </ButtonGroup>
         </div>

         <ButtonGroup name="Custom Components">
            <Button
               @click="$push.promise('Your message has been successfully sent. Please.')"
               text="Static"
            >
               <VueIcon />
            </Button>
            <Button
               @click="$push.promise('Your message has been successfully sent. Please.')"
               text="Promise"
            >
               <VueIcon />
            </Button>
            <Button
               @click="$push.promise('Your message has been successfully sent. Please.')"
               text="Promise Multi"
            >
               <VueIcon />
            </Button>
         </ButtonGroup>

         <ButtonGroup name="Actions">
            <Button @click="$push.clearAll()" text="Dismiss All"> <Dismiss /> </Button>
            <Button @click="$push.destroyAll()" text="Destroy All">
               <Destroy />
            </Button>
         </ButtonGroup>
      </div>
   </nav>
</template>

<style scoped>
nav {
   padding: 10px 10px 20px 0;
   background-color: var(--nav-bg-color);
   backdrop-filter: blur(6px);
   border-top: 1px solid var(--nav-border-color);
   display: flex;
   justify-content: center;
   width: 100%;
   z-index: 2147483647;
   bottom: 0;
   left: 0;
   position: fixed;
   overflow: hidden;
}

.Container {
   overflow: auto;
   padding: 10px;
   width: max-content;
   display: grid;
   grid-auto-flow: column;
   gap: 50px;
}

.DefaultComponent {
   display: grid;
   grid-auto-flow: column;
   gap: 10px;
}
</style>
