<script setup lang="ts">
import {
   computed,
   shallowReactive,
   ref,
   watch,
   shallowRef,
   toRef,
   nextTick,
   onBeforeUnmount,
   type CSSProperties,
} from 'vue'

import { useElements, useItems } from '@/core/useStore'
import { isMouse, isReducedMotion } from '@/core/utils'
import { NotificationTypeKeys as NType } from '@/core/constants'

import type { NotivueSlot } from 'notivue'

// Props

const props = withDefaults(
   defineProps<{
      /** Notivue's exposed notification item. */
      item: NotivueSlot
      /**
       * Whether to enable clear on swipe only on touch interactions.
       */
      touchOnly?: boolean
      /** A [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
       * string that specifies elements to be exempted from the swipe action.
       *
       * @default "a, button"
       */
      exclude?: string
      /** Whether to disable the swipe gesture or not.
       * Useful for disabling the behavior on desktop devices, for example.
       *
       * @default false
       */
      disabled?: boolean
      /** Fraction of notification's width needed to be swiped for clearing.
       * For instance, a threshold of 0.5 indicates 50% of the notification's width must be swiped.
       *
       * @default 0.5
       */
      threshold?: number
   }>(),
   { touchOnly: false, exclude: 'a, button', disabled: false, threshold: 0.5 }
)

const touchOnly = toRef(props, 'touchOnly')
const exclude = toRef(props, 'exclude')
const isDisabledByUser = toRef(props, 'disabled')
const threshold = toRef(props, 'threshold')

const isPromise = computed(() => props.item.type === NType.PROMISE)
const isEnabled = computed(
   () => !items.isStreamFocused.value && !isDisabledByUser.value && !isPromise.value
)

// Store

const items = useItems()
const elements = useElements()

const lastItemContainer = computed(() => elements.items.value[elements.items.value.length - 1])

// Internal

const RETURN_DUR = 300

const itemRef = ref<HTMLElement | null>(null)

const state = shallowReactive({
   targetLeft: 0,
   targetRight: 0,
   targetWidth: 0,
   isLocked: false,
   isPressed: false,
   isClearing: false,
   startX: 0,
   currentX: 0,
})

const styles = shallowRef<CSSProperties>({})

function setState(properties: Partial<typeof state>) {
   Object.assign(state, properties)
}

function setStyles(properties: CSSProperties) {
   styles.value = { ...styles.value, ...properties }
}

function resetStyles() {
   styles.value = {}
}

/* ====================================================================================
 * Utils
 * ==================================================================================== */

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
   }) // Could this be done the Vue way?
}

function resetDragStyles() {
   if (!itemRef.value) return

   resetStyles()

   itemRef.value.querySelectorAll('*').forEach((el) => {
      if (el instanceof HTMLElement) {
         el.style.touchAction = 'auto'
         el.style.userSelect = 'auto'
      }
   })
}

function shouldSwipe(e: PointerEvent) {
   return touchOnly.value && e.pointerType !== 'touch' ? false : true
}

function setTargetPosition() {
   if (!itemRef.value) return

   const { left, right, width } = itemRef.value.getBoundingClientRect()

   setState({
      targetLeft: left,
      targetRight: right,
      targetWidth: width,
   })
}

function setReturnStyles() {
   setStyles({
      transition: isReducedMotion() ? 'none' : `${RETURN_DUR}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      transform: `translate3d(0px, 0px, 0px)`,
      opacity: '1',
   })
}

function isPointerInside(e: PointerEvent) {
   return e.clientX > state.targetLeft && e.clientX < state.targetRight
}

/* ====================================================================================
 * Event Handlers
 * ==================================================================================== */

function onPointerEnter(e: PointerEvent) {
   if (!shouldSwipe(e)) resetDragStyles()
}

function onPointerDown(e: PointerEvent) {
   if (!shouldSwipe(e)) return

   /**
    * Prevents the `useTouchEvents` handler to fire, which is what
    * we're looking for so it doesn't interfere.
    */
   e.stopPropagation()

   if (!itemRef.value) return
   if (e.button !== 0) return // Only left clicks
   if (state.isPressed || state.isClearing || state.isLocked) return

   if (exclude.value) {
      const excludedEls = Array.from(itemRef.value.querySelectorAll(exclude.value))
      if (excludedEls.includes(e.target as HTMLElement)) return
   }

   if (!isMouse(e)) items.pauseTimeouts()

   setState({
      startX: e.clientX,
      isPressed: true,
   })
}

function onPointerMove(e: PointerEvent) {
   if (!shouldSwipe(e)) return

   e.stopPropagation()

   if (!state.isPressed) return
   if (state.isClearing || state.isLocked) return

   setStyles({
      transition: 'none',
      transform: `translate3d(${state.currentX}px, 0px, 0px)`,
      opacity: `${1 - Math.abs(state.currentX) / (state.targetWidth * 0.65)}`,
   })

   setState({
      currentX: e.clientX - state.startX,
   })

   if (Math.abs(state.currentX) > state.targetWidth * threshold.value) {
      state.isClearing = true
      onPointerMoveClear(e)
   }
}

function onPointerMoveClear(e: PointerEvent) {
   props.item.clear()

   if (isMouse(e) && isPointerInside(e)) {
      const isLastItem = lastItemContainer.value.contains(itemRef.value)
      if (!isLastItem) items.pauseTimeouts()
   } else {
      items.resumeTimeouts()
   }

   const animDuration = parseFloat(elements.getTransitionData()?.duration ?? 0) * 1000
   setTimeout(() => (state.isClearing = false), animDuration)
}

/**
 * Never triggered if the notification has been closed on pointer move.
 */
function onPointerUp(e: PointerEvent) {
   if (!shouldSwipe(e)) return

   e.stopPropagation()

   if (!state.isPressed) return
   if (state.isClearing || state.isLocked) return

   if (isMouse(e) && isPointerInside(e)) {
      items.pauseTimeouts()
   } else {
      items.resumeTimeouts()
   }

   setReturnStyles()

   setState({
      startX: 0,
      currentX: 0,
      isPressed: false,
      isLocked: true,
   })

   setTimeout(() => (state.isLocked = false), RETURN_DUR)
}

function onPointerLeave(e: PointerEvent) {
   if (!shouldSwipe(e)) return

   e.stopPropagation()

   if (!state.isPressed) return
   if (state.isClearing || state.isLocked) return

   setReturnStyles()

   setState({
      startX: 0,
      currentX: 0,
      isPressed: false,
      isLocked: false,
   })

   items.resumeTimeouts()
}

/* ====================================================================================
 * Lifecycle / Watchers
 * ==================================================================================== */

const events = [
   ['pointerenter', onPointerEnter],
   ['pointerdown', onPointerDown],
   ['pointermove', onPointerMove],
   ['pointerup', onPointerUp],
   ['pointerleave', onPointerLeave],
] as const

function addListeners() {
   window.addEventListener('resize', setTargetPosition)

   if (!itemRef.value) return

   events.forEach(([event, handler]) => {
      itemRef.value!.addEventListener(event, handler)
   })
}

function removeListeners() {
   window.removeEventListener('resize', setTargetPosition)

   if (!itemRef.value) return

   events.forEach(([event, handler]) => {
      itemRef.value!.removeEventListener(event, handler)
   })
}

watch(
   isEnabled,
   (_isEnabled, _, onCleanup) => {
      nextTick(() => {
         if (_isEnabled) {
            setDragStyles()
            setTargetPosition()
            nextTick(addListeners)
         }
      })

      onCleanup(() => {
         removeListeners()
         resetDragStyles()
         // No need to reset target position as they will be recomputed on next enabling
      })
   },
   { immediate: true, flush: 'post' }
)

onBeforeUnmount(removeListeners)
</script>

<template>
   <div ref="itemRef" :style="styles" v-if="!isDisabledByUser">
      <slot />
   </div>

   <slot v-else />
</template>
