<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watchEffect } from 'vue'
import { setTheme, store } from '../store'
import { usePush } from '../../src'

import ButtonGroup from './ButtonGroup.vue'
import PositionControls from './PositionControls.vue'
import Button from './Button.vue'
import SuccessIcon from '../icons/Success.vue'
import VueIcon from '../icons/Vue.vue'
import PromiseIcon from '../icons/Promise.vue'
import Info from '../icons/Info.vue'
import Warn from '../icons/Warn.vue'
import Dismiss from '../icons/Dismiss.vue'
import Destroy from '../icons/Destroy.vue'
import Controls from './ComponentControls.vue'
import ThemesControls from './ThemesControls.vue'
import CustomSocial from './CustomSocial.vue'
import CustomPromise from './CustomPromise.vue'

const navRef = ref<HTMLElement | null>(null)

const push = usePush()

function customPush() {
   if (store.theme === 'dark' || store.theme === 'slate') {
      setTheme('light')
   }

   push.info({
      title: false,
      message: store.rtl
         ? 'Stephanie LaGarde تريد إرسال رسالة لك.'
         : 'Stephanie LaGarde wants to send you a message.',
      render: {
         component: () => CustomSocial,

         props: ({ notivueProps }) => ({
            clear: notivueProps.clear,
            timeAgo: store.rtl ? 'منذ 5 دقائق' : '5 mins ago',
            name: 'Stephanie LaGarde',
            message: store.rtl ? 'تريد إرسال رسالة لك.' : 'wants to send you a message.',
         }),
      },
   })
}

async function customAsync() {
   if (store.theme === 'dark' || store.theme === 'slate') {
      setTheme('light')
   }

   const promise = push.promise({
      message: store.rtl ? 'جاري تحميل الملف…' : 'Uploading file…',
      title: false,
      render: {
         component: () => CustomPromise,
         props: ({ notivueProps }) => ({
            ...notivueProps,
            fileName: 'report_2022.xlsx',
         }),
      },
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   promise.resolve({
      message: store.rtl ? 'تم تحميل الملف بنجاح!' : 'File successfully uploaded!',
      title: false,
      render: {
         props: ({ notivueProps, prevProps }) => ({
            ...notivueProps,
            ...prevProps,
            remainingSpace: 129.01,
            timeAgo: store.rtl ? 'منذ دقيقة' : '1 min ago',
         }),
      },
   })
}

const copy = computed(() => {
   function getTitle(rtl: string, ltr: string) {
      return !store.renderTitles ? false : store.rtl ? rtl : ltr
   }

   return {
      success: {
         title: getTitle('نجاح', 'Success'),
         message: store.rtl
            ? 'تم إرسال رسالتك بنجاح. لو سمحت.'
            : 'Your message has been successfully sent.',
      } as const,
      error: {
         title: getTitle('فشل', 'Error'),
         message: store.rtl
            ? 'لقد حدث خطأ أثناء إرسال رسالتك. لو سمحت.'
            : 'An error occurred while sending your message.',
      } as const,
      warning: {
         title: getTitle('تحذير', 'Warning'),
         message: store.rtl
            ? 'لديك 290 رسالة فقط متبقية على حسابك. يرجى شحن الرصيد.'
            : 'You have only 290 messages left on your account. Please top up.',
      } as const,
      info: {
         title: getTitle('معلومات', 'Info'),
         message: store.rtl
            ? 'هل تعلم أنك يمكنك إرسال رسالة باستخدام لوحة المفاتيح؟ اضغط على Enter للإرسال.'
            : 'Did you know you can send a message using the keyboard?',
      } as const,
      promise: {
         title: getTitle('ارسال رسالة', 'Sending message...'),
         message: store.rtl
            ? 'نحن نرسل رسالتك. سيستغرق ذلك لحظة أو اثنتين ...'
            : 'Please wait while we send your message...',
      } as const,
   }
})

async function asyncPush() {
   const promise = push.promise({
      title: copy.value.promise.title,
      message: copy.value.promise.message,
   })

   await new Promise((resolve) => setTimeout(resolve, getRandomInt(2000, 4000)))

   if (Math.random() > 0.5) {
      promise.resolve({
         title: copy.value.success.title,
         message: copy.value.success.message,
      })
   } else {
      promise.reject({
         title: copy.value.error.title,
         message: copy.value.error.message,
      })
   }
}

function getNavHeight() {
   document.documentElement.style.setProperty(
      '--nv-root-bottom',
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

function getRandomInt(min: number, max: number) {
   min = Math.ceil(min)
   max = Math.floor(max)
   return Math.floor(Math.random() * (max - min) + min)
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
            <ButtonGroup name="Push 👇" isPush>
               <Button
                  @click="
                     push.success({
                        title: copy.success.title,
                        message: copy.success.message,
                     })
                  "
                  text="Success"
               >
                  <SuccessIcon />
               </Button>
               <Button
                  @click="
                     push.error({
                        title: copy.error.title,
                        message: copy.error.message,
                     })
                  "
                  text="Error"
               >
                  <Warn :isWarn="false" />
               </Button>
               <Button
                  @click="
                     push.warning({ title: copy.warning.title, message: copy.warning.message })
                  "
                  text="Warn"
               >
                  <Warn :isWarn="true" />
               </Button>
               <Button
                  @click="push.info({ title: copy.info.title, message: copy.info.message })"
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

         <ButtonGroup name="Custom 👇" isPush>
            <Button @click="customPush" text="Static">
               <VueIcon />
            </Button>
            <Button @click="customAsync" text="Promise">
               <VueIcon />
            </Button>
         </ButtonGroup>

         <ButtonGroup name="Actions">
            <Button @click="push.clearAll()" text="Dismiss All"> <Dismiss /> </Button>
            <Button @click="push.destroyAll()" text="Destroy All">
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
   gap: 10px;
   grid-auto-flow: column;
}
</style>
