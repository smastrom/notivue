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

import { useStore } from '@/core/useStore'
import { isMouse, isReducedMotion } from '@/core/utils'
import { NotificationTypeKeys as NType } from '@/core/constants'

import type { NotivueSwipeProps } from './types'

// Store

const { timeouts, elements, animations } = useStore()

// Props

const props = withDefaults(defineProps<NotivueSwipeProps>(), {
   touchOnly: false,
   exclude: 'a, button',
   disabled: false,
   threshold: 0.5,
   playLeave: true,
})

const touchOnly = toRef(props, 'touchOnly')
const exclude = toRef(props, 'exclude')
const isDisabledByUser = toRef(props, 'disabled')
const threshold = toRef(props, 'threshold')
const destroy = toRef(props, 'destroy')

const isPromise = computed(() => props.item.type === NType.PROMISE)
const isEnabled = computed(
   () =>
      !timeouts.isStreamFocused.value &&
      !isDisabledByUser.value &&
      !isPromise.value &&
      props.item.duration < Infinity
)

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
         el.style.userSelect = 'none'
         el.style.touchAction = 'none'
      }
   })
}

function resetDragStyles() {
   if (!itemRef.value) return

   resetStyles()

   itemRef.value.querySelectorAll('*').forEach((el) => {
      if (el instanceof HTMLElement) {
         el.style.userSelect = 'auto'
         el.style.touchAction = 'auto'
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

   if (!isMouse(e)) timeouts.pause()

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
   if (destroy.value) {
      props.item.destroy()
   } else {
      props.item.clear()
   }

   if (isMouse(e) && isPointerInside(e)) {
      const isLastItem = lastItemContainer.value.contains(itemRef.value)
      if (!isLastItem) timeouts.pause()
   } else {
      timeouts.resume()
   }

   const animDuration = parseFloat(animations.getTransitionData()?.duration ?? 0) * 1000
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
      timeouts.pause()
   } else {
      timeouts.resume()
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

   timeouts.resume()
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
