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
import { isMouse } from '@/core/utils'
import { NotificationTypeKeys as NType } from '@/core/constants'
import { DEFAULT_PROPS, DEBOUNCE, RETURN_DUR } from './constants'

import type { NotivueSwipeProps } from 'notivue'

/**
 * MOUSE - Notivue's mouse events (get from 'useMouseEvents') will still handle the pause/resume logic
 * on hover. NotivueSwipe will only additionally pause timeouts while swiping and resume them
 * when clearing.
 *
 * TOUCH / PEN - Notivue's touch events (get from 'useTouchEvents') execution is prevented when
 * using NotivueSwipe. That's because a more granular timeout control is required due
 * to all possible interactions hence the whole touch logic is handled here.
 *
 * When releasing, leaving or clearing a notification via Swipe a small debounce time is added to
 * improve UX.
 */

// Store

const { timeouts, elements, animations } = useStore()

// Props

const props = withDefaults(defineProps<NotivueSwipeProps>(), DEFAULT_PROPS)

const touchOnly = toRef(props, 'touchOnly')
const exclude = toRef(props, 'exclude')
const isDisabledByUser = toRef(props, 'disabled')
const threshold = toRef(props, 'threshold')

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

   const { offsetLeft, clientWidth } = itemRef.value

   setState({
      targetLeft: offsetLeft,
      targetRight: offsetLeft + clientWidth,
      targetWidth: clientWidth,
   })
}

function setReturnStyles() {
   setStyles({
      transition: animations.isReducedMotion.value
         ? 'none'
         : `${RETURN_DUR}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      transform: `translate3d(0px, 0px, 0px)`,
      opacity: '1',
   })
}

function isPointerInside(e: PointerEvent) {
   return e.clientX > state.targetLeft && e.clientX < state.targetRight
}

function getDebounceMs(e: PointerEvent) {
   return isMouse(e) ? DEBOUNCE.Mouse : DEBOUNCE.Touch
}

function pauseTimeouts() {
   window.clearTimeout(timeouts.touchDebounceTimeout)
   timeouts.pause()
}

function resumeTimeouts(ms: number) {
   window.clearTimeout(timeouts.touchDebounceTimeout)

   timeouts.touchDebounceTimeout = window.setTimeout(() => {
      timeouts.resume()
   }, ms)
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
    * Prevents `useTouchEvents` events to fire, which is what
    * we're looking for so they doen't interfere with NotivueSwipe logic.
    */
   e.stopPropagation()

   if (!itemRef.value) return
   if (e.button !== 0) return // Only left clicks
   if (state.isPressed || state.isClearing || state.isLocked) return

   if (exclude.value) {
      const excludedEls = Array.from(itemRef.value.querySelectorAll(exclude.value))

      if (excludedEls.includes(e.target as HTMLElement)) {
         /**
          * When tapping an excluded element, we want to pause and resume timeouts
          * after a bit, keeping the same behavior as Notivue touch events (useTouchEvents).
          *
          * This is not required when using the mouse as the pause/resume is already handled on
          * hover by useMouseEvents.
          */
         if (!isMouse(e)) {
            pauseTimeouts()
            resumeTimeouts(DEBOUNCE.TouchExternal)
         }

         return
      }
   }

   if (!isMouse(e)) pauseTimeouts()

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
      opacity: `${1 - (Math.abs(state.currentX) / state.targetWidth) * (1 / threshold.value)}`,
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
   props.item.destroy()

   if (isMouse(e) && isPointerInside(e)) {
      const isLastItem = lastItemContainer.value.contains(itemRef.value)
      if (!isLastItem) pauseTimeouts()
   } else {
      resumeTimeouts(getDebounceMs(e))
   }

   const animDuration = parseFloat(animations.getTransitionData()?.duration ?? 0) * 1000
   window.setTimeout(() => (state.isClearing = false), animDuration)
}

/**
 * Triggered when the notification is swiped and then released but not enough
 * to be cleared.
 *
 * Callback logic is not executed if the notification gets closed while swiping.
 */
function onPointerUp(e: PointerEvent) {
   if (!shouldSwipe(e)) return

   e.stopPropagation()

   if (!state.isPressed) return
   if (state.isClearing || state.isLocked) return

   if (isMouse(e) && isPointerInside(e)) {
      pauseTimeouts()
   } else {
      resumeTimeouts(getDebounceMs(e))
   }

   setReturnStyles()

   setState({
      startX: 0,
      currentX: 0,
      isPressed: false,
      isLocked: true,
   })

   window.setTimeout(() => (state.isLocked = false), RETURN_DUR)
}

/**
 * Triggered when the pointer leaves the notification bounding box while swiping.
 */
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

   resumeTimeouts(getDebounceMs(e))
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
