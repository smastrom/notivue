<script setup lang="ts">
import {
   onBeforeUnmount,
   onMounted,
   ref,
   computed,
   toRefs,
   provide,
   readonly,
   nextTick,
   watch,
   type Component,
} from 'vue'

import { useNotivue, useStore } from '@/core/useStore'
import { focusableEls, keyboardInjectionKey } from './constants'
import { useKeyboard } from './useKeyboard'
import { useLastFocused } from './useLastFocused'

import type { PushOptions } from 'notivue'

import type { TabIndexValue, ContainersTabIndexMap, NotivueKeyboardProps } from './types'

// Props

const props = withDefaults(defineProps<NotivueKeyboardProps>(), {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage: "You're leaving the notifications stream. Press Control + N to navigate it again.",
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: true,
   maxAnnouncements: 3,
})

const { comboKey, handleClicks, leaveMessage, emptyMessage, renderAnnouncement, maxAnnouncements } =
   toRefs(props)

// Slots

defineSlots<{
   default(props: {
      elementsTabIndex: TabIndexValue
      containersTabIndex: ContainersTabIndexMap
   }): Component
}>()

// Computed

const sharedOptions = {
   ariaRole: 'alert',
   ariaLive: 'assertive',
   skipQueue: true,
   ariaLiveOnly: !renderAnnouncement.value,
   props: {
      isNotivueKeyboard: true,
   },
} as const

const leavePushOptions = computed<PushOptions>(() => ({
   message: leaveMessage.value,
   ...sharedOptions,
}))

const emptyPushOptions = computed<PushOptions>(() => ({
   message: emptyMessage.value,
   ...sharedOptions,
}))

// Store

const { elements, items, timeouts, push, queue } = useStore()

const config = useNotivue()

/* ====================================================================================
 * Internal state
 * ==================================================================================== */

const { focusLastElement } = useLastFocused()
const { isKeyboard } = useKeyboard()

const candidateIds = ref({ qualified: [] as string[], unqualified: [] as string[] })

const candidateContainers = ref<HTMLElement[]>([])
const unqualifiedContainers = ref<HTMLElement[]>([])

const elementsTabIndex = ref<TabIndexValue>(-1)

function setTabIndex(value: TabIndexValue) {
   elementsTabIndex.value = value
}

// Non-reactive

let announcementsCount = 0

let hasNeverTabbedStream = true
let allInnerFocusableEls: HTMLElement[] = []

// Computed

const containersTabIndex = computed(() => {
   const map = {} as ContainersTabIndexMap

   candidateIds.value.qualified.forEach((id) => (map[id] = elementsTabIndex.value))
   candidateIds.value.unqualified.forEach((id) => (map[id] = -1))

   return map
})

// Actions

function onStreamEnter() {
   if (candidateContainers.value.length === 0) return

   setTabIndex(0)

   timeouts.setStreamFocus()
   timeouts.pause()

   nextTick(() => {
      candidateContainers.value[0].focus()
   })
}

function onStreamLeave({ announce = true } = {}) {
   focusLastElement()

   setTabIndex(-1)

   timeouts.unsetStreamFocus()
   timeouts.resume()

   if (announce && announcementsCount < maxAnnouncements.value) {
      announcementsCount++

      push.info(leavePushOptions.value)
   }
}

// Provide

provide(keyboardInjectionKey, {
   containersTabIndex,
   elementsTabIndex: readonly(elementsTabIndex),
})

/* ====================================================================================
 * Collect candidates/unqualified
 * ==================================================================================== */

watch(elements.containers, setCandidates, { deep: true })

function setCandidates(newContainers: HTMLElement[]) {
   const _ids = { qualified: [] as string[], unqualified: [] as string[] }

   let _candidateContainers: HTMLElement[] = []
   let _unqualifiedContainers: HTMLElement[] = []

   let _focusableEls: HTMLElement[] = []

   newContainers
      .map((container) => ({ id: container.dataset.notivueContainer!, container }))
      .sort((a, b) => +b.id - +a.id)
      .forEach(({ id, container }) => {
         const innerFocusableEls = Array.from(container.querySelectorAll(focusableEls)).filter(
            (el) => el instanceof HTMLElement
         ) as HTMLElement[]

         _focusableEls.push(...innerFocusableEls)

         if (innerFocusableEls.length > 1) {
            _ids.qualified.push(id)
            _candidateContainers.push(container)
         } else {
            _ids.unqualified.push(id)
            _unqualifiedContainers.push(container)
         }
      })

   candidateIds.value = _ids

   candidateContainers.value = _candidateContainers
   unqualifiedContainers.value = _unqualifiedContainers

   allInnerFocusableEls = _focusableEls
}

/* ====================================================================================
 * On new candidates-push behavior (enter the stream or focus the first)
 * ==================================================================================== */

watch(
   candidateContainers,
   (currCandidates, prevCandidates, onCleanup) => {
      if (currCandidates.length === 0) return

      const hasCandidates = currCandidates.length > 0
      const isNewCandidate = currCandidates.some((container) => {
         return !prevCandidates.some((prevContainer) => prevContainer === container)
      })

      const isAlreadyNavigating = isNewCandidate && timeouts.isStreamFocused.value

      const shouldAddEnterListener =
         (isNewCandidate && !timeouts.isStreamFocused.value) ||
         (hasCandidates && hasNeverTabbedStream)

      if (isAlreadyNavigating) {
         currCandidates[0].focus()
      } else if (shouldAddEnterListener) {
         addEnterListener()
      }

      onCleanup(() => {
         if (shouldAddEnterListener) removeEnterListener()
      })
   },
   { flush: 'post' }
)

function onAllowedStreamNavigation(e: KeyboardEvent) {
   if (!e.shiftKey && e.key === 'Tab' && candidateContainers.value.length > 0) {
      e.preventDefault()

      if (hasNeverTabbedStream) hasNeverTabbedStream = false

      onStreamEnter()
      nextTick(removeEnterListener)
   }
}

function addEnterListener() {
   removeEnterListener()
   document.addEventListener('keydown', onAllowedStreamNavigation)
}

function removeEnterListener() {
   document.removeEventListener('keydown', onAllowedStreamNavigation)
}

/* ====================================================================================
 * Queue - On new unqualified-push behavior (leave the stream or focus the first candidate)
 * ==================================================================================== */

/**
 * If unqualified are pushed from the queue (after manual dismissal),
 * we want to exit and resume timeouts if no candidates are left.
 *
 * In this case we do not announce the exit as it would be redundant.
 * If a new candidate is pushed next, it can be focused with Tab as usual.
 *
 * If candidates are instead available, we simply move the focus to the first one.
 */
watch(
   unqualifiedContainers,
   (newUnqualified) => {
      if (!config.enqueue.value || !timeouts.isStreamFocused.value) return

      if (newUnqualified.length > 0) {
         if (candidateContainers.value.length > 0) {
            candidateContainers.value[0].focus()
         } else {
            onStreamLeave({ announce: false })
         }
      }
   },
   { flush: 'post' }
)

/**
 * Needed to track whether the user is leaving the stream
 * using the keyboard (TAB or SHIFT+TAB)
 *
 * In any other case, we toggle the state manually (onKeydown)
 * and do not use watchers.
 */
let isManualLeave = false

watch(
   elements.wrapper,
   (stream, _, onCleanup) => {
      function onStreamFocusOut(e: FocusEvent) {
         e.preventDefault()
         e.stopPropagation()

         if (!timeouts.isStreamFocused.value) return
         if (!isKeyboard.value) return

         if (isManualLeave) return (isManualLeave = false)

         if (!stream?.contains(e.relatedTarget as HTMLElement)) {
            onStreamLeave()
         }
      }

      if (stream) stream.addEventListener('focusout', onStreamFocusOut)

      onCleanup(() => {
         if (stream) stream.removeEventListener('focusout', onStreamFocusOut)
      })
   },
   { immediate: true, flush: 'post' }
)

/* ====================================================================================
 * Manually leaving the stream using events
 * ==================================================================================== */

function onCandidatesKeydown(e: KeyboardEvent) {
   let currCandidateIndex = 0
   const isNavigatingCandidates = candidateContainers.value.some((container, index) => {
      if (container.contains(e.target as HTMLElement) || container === e.target) {
         currCandidateIndex = index
         return true
      }
   })

   if (isNavigatingCandidates) {
      if (e.key === 'Escape') {
         e.preventDefault()

         isManualLeave = true
         return onStreamLeave()
      }

      if (!handleClicks.value) return

      const isClickable =
         e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement

      if (isClickable && (e.key === '\u00A0' || e.key === ' ' || e.key === 'Enter')) {
         e.preventDefault()

         isManualLeave = true
         e.target.click()

         /**
          * If the queue has items, we simply do not perform any operation.
          * Once the new candidate is pushed, it will be focused automatically.
          */
         if (queue.getLength() > 0) return

         const nextContainer = candidateContainers.value[currCandidateIndex + 1]

         if (nextContainer) {
            nextContainer.focus()
         } else {
            onStreamLeave()
         }
      }
   }
}

function onComboKeyDown(e: KeyboardEvent) {
   if (
      e.ctrlKey &&
      (e.key === comboKey.value.toLowerCase() || e.key === comboKey.value.toUpperCase())
   ) {
      e.preventDefault()

      if (timeouts.isStreamFocused.value) {
         isManualLeave = true

         return onStreamLeave()
      } else {
         if (candidateContainers.value.length > 0) {
            onStreamEnter()
         } else {
            push.info(emptyPushOptions.value)
         }
      }
   }
}

/**
 * If clicking any action (even inside unqualified) with a device different than the keyboard,
 * we want to resume timeouts and disable stream tabbing.
 *
 * Same if clicking any element outside the stream.
 */
function onActionsMouseClick(e: MouseEvent) {
   if (timeouts.isStreamFocused.value && !isKeyboard.value) {
      if (!elements.wrapper.value?.contains(e.target as HTMLElement)) {
         onStreamLeave()
      }

      if (allInnerFocusableEls.includes(e.target as HTMLElement)) {
         onStreamLeave()
      }
   }
}

const events = [
   ['click', onActionsMouseClick],
   ['keydown', onCandidatesKeydown],
   ['keydown', onComboKeyDown],
] as const

onMounted(() => {
   events.forEach(([event, handler]) => window.addEventListener(event, handler as EventListener))
})

onBeforeUnmount(() => {
   items.clear()
   queue.clear()

   events.forEach(([event, handler]) => {
      document.removeEventListener(event, handler as EventListener)
   })
})
</script>

<template>
   <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
</template>
