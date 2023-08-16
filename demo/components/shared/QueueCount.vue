<script setup lang="ts">
import { useNotifications, useNotivue } from 'notivue'

const { queue } = useNotifications()

const { isTopAlign } = useNotivue()

const wrapperStyles = computed(() => {
   if (isTopAlign.value) {
      return { bottom: 'calc(var(--nav-height) + 1.25rem)' }
   }
   return { top: '1.25rem' }
})
</script>

<template>
   <Transition name="FadeTransition">
      <div class="Wrapper" v-if="queue.length > 0" :style="wrapperStyles">
         <span class="Dot" :key="Math.random()">
            <span class="BreathAnim">
               {{ queue.length }}
            </span>
         </span>

         <span>Enqueued</span>
      </div>
   </Transition>
</template>

<style scoped>
.Wrapper {
   position: fixed;
   z-index: 250;
   left: 50%;
   transform: translateX(-50%);
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: 0.25rem;
   font-family: var(--app-font-family);
   color: var(--button-color);
   font-weight: 700;
   user-select: none;
}
.Dot {
   width: 2.5rem;
   height: 2.5rem;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 9999px;
   background-color: var(--button-active-bg-color);
}

.FadeTransition-enter-active,
.FadeTransition-leave-active {
   transition: opacity 150ms ease-out;
}

.FadeTransition-enter-from,
.FadeTransition-leave-to {
   opacity: 0.5;
}

.BreathAnim {
   line-height: 1;
   font-size: 1.3rem;
   animation: BreathAnimKF 250ms ease-out forwards;
   color: var(--button-active-color);

   @media (prefers-reduced-motion: reduce) {
      animation: none;
   }
}

@keyframes BreathAnimKF {
   0% {
      transform: scale(1);
   }
   50% {
      transform: scale(1.25);
   }
   100% {
      transform: scale(1);
   }
}
</style>
