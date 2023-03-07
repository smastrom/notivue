<script setup lang="ts">
import { ref } from 'vue'
import { ReceiverProps } from '../src/types'
import { usePush } from '../src/usePush'
import { settings } from './store'
import Custom from './Custom.vue'

import { _PushOptions } from '../src/types'

const push = usePush()

const pushToUser = usePush('user-1')

function getRandomInt(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
}

function usePostSuccess<T extends _PushOptions & { props?: Record<string, any> }>() {
   return ({ props = {}, ...options }: T) =>
      push.success({
         ...options,
         render: {
            component: () => Custom,
            props: ({ notsyProps }) => ({
               ...notsyProps,
               ...props,
            }),
         },
      })
}

const pushX = usePostSuccess()

async function asyncPush() {
   const ayncNotify = push.promise({
      message: "We're sending your message. This will take a moment or two...",
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   if (Math.random() > 0.3) {
      ayncNotify.reject({ message: 'Promise rejected!' })
   } else {
      ayncNotify.resolve({ message: 'Promise successfully resolved!'.repeat(6) })
   }
}

function customPush() {
   pushX({
      duration: 5000,
      message: 'Your message has been successfully sent. Please.',
      props: {
         avatarUrl: 'https://i.pravatar.cc/150?img=2',
         nameSurname: 'John Doe',
      },
   })

   /*    push({
      message: 'Custom',
      render: {
         component: markRaw(Custom),
         props: ({ notsyProps }) => ({
            ...notsyProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   }) */

   /*    push({
      message: 'Custom',
      render: {
         component: markRaw(Custom),
         props: ({ notsyProps }) => ({}),
      },
   }) */
}

async function customAsync() {
   const promise = push.promise({
      message: 'Async',
      render: {
         component: () => Custom,
         props: ({ notsyProps }) => ({
            ...notsyProps,
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
         props: ({ notsyProps, prevProps }) => ({
            ...notsyProps,
            ...prevProps,
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
         }),
      },
   })

   /*    promise.reject({
      message: 'Async resolved',
      render: {
         component: markRaw(Custom),
         props: ({ notsyProps }) => ({
            ...notsyProps,
         }),
      },
   })

   promise.reject({
      message: 'Async resolved',
      render: {
         component: markRaw(Custom),
         props: ({ notsyProps }) => ({}),
      },
   }) */
}

function setPosition(position: ReceiverProps['position']) {
   settings.position = position
}

function setWidth() {
   settings.maxWidth = settings.maxWidth === '1280px' ? '100%' : '1280px'
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

function toggleRtl() {
   document.documentElement.dir = 'rtl'
}
</script>

<template>
   <nav dir="ltr">
      <div>
         <button @click="setWidth">
            {{ settings.maxWidth === '1280px' ? 'Full Width' : 'Container Width' }}
         </button>
         <button @click="setPosition('topLeft')">Top Left</button>
         <button @click="setPosition('topCenter')">Top Center</button>
         <button @click="setPosition('topRight')">Top Right</button>
         <button @click="setPosition('bottomLeft')">Bottom Left</button>
         <button @click="setPosition('bottomCenter')">Bottom Center</button>
         <button @click="setPosition('bottomRight')">Bottom Right</button>
      </div>

      <div>
         <button
            @click="
               pushToUser({
                  message:
                     'Your message has been successfully sent. Please. Your message has been successfully sent. Please. Your message has been successfully sent. Please. Your message has been successfully sent. Please.'.repeat(
                        5
                     ),
               })
            "
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
                  push({
                     message: `${counter} Your message has
                     been successfully **sent**. Please.`,
                  })
               }
            "
         >
            Success
         </button>
         <button
            @click="$push.success({ message: 'Your message has been successfully sent. Please.' })"
         >
            Push $
         </button>
         <button
            @click="
               () => {
                  toggleRtl()
                  $push.success({
                     title: 'إستعمل استعملت من على',

                     message:
                        'وتم وسفن الخاسر الشتاء، هو. عرض أثره، أعمال تم, حدى قد كنقطة الإمداد بمحاولة.',
                  })
               }
            "
         >
            Push RTL
         </button>
         <button
            @click="push.error({ message: 'Your **message** has been successfully sent. Please.' })"
         >
            Error
         </button>

         <button @click="push.destroyAll()">Destroy</button>
         <button
            @click="
               push.info({
                  message: 'Your message has been successfully sent. Please.',
                  className: 'custom-class',
               })
            "
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
   background-color: #444254;
   gap: 20px;
   justify-content: center;
   z-index: 2147483647;
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
