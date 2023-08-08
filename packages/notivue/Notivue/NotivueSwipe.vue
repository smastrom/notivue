<script setup lang="ts">
import {
   computed,
   reactive,
   ref,
   watch,
   shallowRef,
   toRef,
   nextTick,
   onBeforeUnmount,
   type CSSProperties,
} from 'vue'

import { useElements, useItems } from '@/core/useStore'
import { isReducedMotion } from '@/core/utils'
import { NotificationTypeKeys as NType } from '@/core/constants'

import type { NotivueSlot } from 'notivue'

enum LeaveType {
   CLEAR,
   OUT,
}

// Props

const props = withDefaults(
   defineProps<{
      /** Notivue's exposed notification item. */
      item: NotivueSlot
      /** A [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) string that specifies elements to be exempted from the swipe action. */
      exclude?: string
      /** Whether to disable the swipe gesture or not. Useful for disabling the behavior on desktop devices, for example. */
      disabled?: boolean
      /** Fraction of notification's width needed to be swiped for clearing. For instance, a threshold of 0.5 indicates 50% of the notification's width must be swiped. */
      threshold?: number
   }>(),
   { exclude: '.Notivue__close', disabled: false, threshold: 0.5 }
)

const isPromise = computed(() => props.item.type === NType.PROMISE)

// Store

const items = useItems()
const elements = useElements()

const lastItemContainer = computed(() => elements.items.value[elements.items.value.length - 1])

// Internal

const isDisabled = toRef(props, 'disabled')
const threshold = toRef(props, 'threshold')
const exclude = toRef(props, 'exclude')

const itemRef = ref<HTMLElement | null>(null)

const state = reactive({
   targetLeft: 0,
   targetRight: 0,
   targetWidth: 0,
   isPressed: false,
   startX: 0,
   currX: 0,
})

const styles = shallowRef<CSSProperties>({})

// Utils

function setStyles(properties: CSSProperties) {
   styles.value = properties
}

function setTargetPosition() {
   if (!itemRef.value) return

   const { left, right, width } = itemRef.value.getBoundingClientRect()

   state.targetLeft = left
   state.targetRight = right
   state.targetWidth = width
}

function handleTimeouts(eClientX: number, leaveType: LeaveType) {
   const isPointerInside = eClientX > state.targetLeft && eClientX < state.targetRight
   const isLastItem = lastItemContainer.value.contains(itemRef.value)

   if (leaveType === LeaveType.CLEAR) {
      if (isPointerInside && isLastItem) {
         items.resumeTimeouts()
      } else {
         items.pauseTimeouts()
      }
   }

   if (leaveType === LeaveType.OUT) {
      if (!isPointerInside) items.resumeTimeouts()
   }
}

function setDragStyles() {
   if (!itemRef.value) return

   setStyles({
      touchAction: 'none',
      userSelect: 'none',
      cursor: 'grab',
   })

   itemRef.value.querySelectorAll('*').forEach((el) => {
      if (el instanceof HTMLElement) {
         el.style.touchAction = 'none'
         el.style.userSelect = 'none'
      }
   })
}

// Event handlers

function onPointerEnter(e: PointerEvent) {
   e.stopPropagation()

   items.pauseTimeouts()
}

function onPointerDown(e: PointerEvent) {
   e.stopPropagation()

   if (state.isPressed) return
   if (!itemRef.value) return

   if (exclude.value) {
      const excludedEls = Array.from(itemRef.value.querySelectorAll(exclude.value))
      if (excludedEls.includes(e.target as HTMLElement)) return
   }

   state.startX = e.clientX
   state.isPressed = true
}

function onPointerMove(e: PointerEvent) {
   e.stopPropagation()

   if (!state.isPressed) return
   if (!itemRef.value) return

   state.currX = e.clientX - state.startX

   setStyles({
      transition: 'none',
      transform: `translate3d(${state.currX}px, 0px, 0px)`,
      opacity: `${1 - Math.abs(state.currX) / (state.targetWidth * 0.65)}`,
   })

   if (Math.abs(state.currX) > state.targetWidth * threshold.value) {
      handleTimeouts(e.clientX, LeaveType.CLEAR)
      props.item.clear()
   }
}

function onPointerUp(e: PointerEvent) {
   e.stopPropagation()

   if (!state.isPressed) return
   if (!itemRef.value) return

   setStyles({
      transition: isReducedMotion() ? 'none' : '300ms cubic-bezier(0.76, 0, 0.24, 1)',
      transform: `translate3d(0px, 0px, 0px)`,
      opacity: '1',
   })

   state.startX = 0
   state.currX = 0
   state.isPressed = false

   handleTimeouts(e.clientX, LeaveType.OUT)
}

// Lifecycle

function addListeners() {
   if (!itemRef.value) return

   setTargetPosition()
   setDragStyles()

   window.addEventListener('resize', setTargetPosition)

   itemRef.value.addEventListener('pointerenter', onPointerEnter)
   itemRef.value.addEventListener('pointerdown', onPointerDown)
   itemRef.value.addEventListener('pointermove', onPointerMove)
   itemRef.value.addEventListener('pointerup', onPointerUp)
}

function removeListeners() {
   if (!itemRef.value) return

   window.removeEventListener('resize', setTargetPosition)

   itemRef.value.removeEventListener('pointerenter', onPointerEnter)
   itemRef.value.removeEventListener('pointerdown', onPointerDown)
   itemRef.value.removeEventListener('pointermove', onPointerMove)
   itemRef.value.removeEventListener('pointerup', onPointerUp)
}

watch(
   isDisabled,
   (isDisabled_, _, onCleanup) => {
      nextTick(() => {
         if (!isDisabled_) addListeners()
      })

      onCleanup(removeListeners)
   },
   { immediate: true, flush: 'post' }
)

onBeforeUnmount(removeListeners)
</script>

<template>
   <div ref="itemRef" :style="styles" v-if="!isDisabled && !isPromise">
      <slot />
   </div>

   <slot v-else />
</template>
