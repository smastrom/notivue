<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { ReceiverProps } from '../src/types'
import { usePush } from '../src/usePush'
import { settings } from './store'
import Custom from './Custom.vue'

const push = usePush()

const pushToUser = usePush('user-1')

function getRandomInt(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

async function asyncPush() {
   const ayncNotify = push.promise({
      message: "We're sending your message. This will take a moment or two...",
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   if (Math.random() > 0.5) {
      ayncNotify.reject({ message: 'Promise rejected!' })
   } else {
      ayncNotify.resolve({ message: 'Promise successfully resolved!' })
   }
}

function customPush() {
   push({
      message: 'Custom',
      render: {
         component: markRaw(Custom),
         props: ({ notifyProps }) => ({
            ...notifyProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   })
}

async function customAsync() {
   const promise = push.promise({
      message: 'Async',
      render: {
         component: markRaw(Custom),
         props: ({ notifyProps }) => ({
            ...notifyProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   })

   await new Promise((resolve) => setTimeout(resolve, 3000))

   promise.resolve({
      message: 'Async resolved',
      render: {
         component: markRaw(Custom),
         props: ({ notifyProps, prevProps }) => ({
            ...notifyProps,
            ...prevProps,
            name: 'Rubrante',
         }),
      },
   })
}

function setPosition(position: ReceiverProps['position']) {
   settings.position = position
}

function setWidth() {
   settings.maxWidth = settings.maxWidth === 1280 ? 0 : 1280
}

function toggleEnable() {
   settings.disabled = !settings.disabled
}

const counter = ref(0)

function pushThousand() {
   let start = 1

   let interval = setInterval(() => {
      push({
         message: `Message Message Message Message ${start}`,
      })
      start++
   }, 60)

   setTimeout(() => {
      clearInterval(interval)
   }, 60 * 100)
}
</script>

<template>
   <nav>
      <div>
         <button @click="setWidth">
            {{ settings.maxWidth === 1280 ? 'Full Width' : 'Container Width' }}
         </button>
         <button @click="setPosition('top-left')">Top Left</button>
         <button @click="setPosition('top-center')">Top Center</button>
         <button @click="setPosition('top-right')">Top Right</button>
         <button @click="setPosition('bottom-left')">Bottom Left</button>
         <button @click="setPosition('bottom-center')">Bottom Center</button>
         <button @click="setPosition('bottom-right')">Bottom Right</button>
      </div>

      <div>
         <button
            @click="pushToUser({ message: 'Your message has been successfully sent. Please.' })"
         >
            To User
         </button>
         <button @click="toggleEnable">
            {{ settings.disabled ? 'Enable' : 'Disable' }}
         </button>
         <button @click="pushThousand">Push 1000</button>
         <button
            @click="
               () => {
                  counter++
                  push({ message: counter + ' Your message has been successfully sent. Please.' })
               }
            "
         >
            Success
         </button>
         <button
            @click="push.error({ message: 'Your message has been successfully sent. Please.' })"
         >
            Error
         </button>

         <button @click="push.destroyAll()">Destroy</button>
         <button
            @click="push.info({ message: 'Your message has been successfully sent. Please.' })"
         >
            Info
         </button>
         <button
            @click="
               push.warning({
                  message: 'Your message has been successfully sent. Please.',
               })
            "
         >
            Warning
         </button>
         <button @click="asyncPush">Promise</button>
         <button @click="customPush">Custom</button>
         <button @click="customAsync">Custom Promise</button>
         <button @click="push.clearAll()">Clear All</button>
      </div>
   </nav>
</template>

<style scoped>
nav {
   box-sizing: border-box;
   pointer-events: none;
   display: flex;
   flex-direction: column;
   width: 100%;
   gap: 20px;
   justify-content: center;
   z-index: 9999999;
   bottom: 0;
   left: 0;
   padding: 30px;
   position: fixed;
}

nav div {
   justify-content: center;
   display: flex;
   flex-wrap: wrap;
   gap: 20px;
}

nav button {
   pointer-events: all;
   width: max-content;
   white-space: nowrap;
}
</style>
