<script setup lang="ts">
import {
   onBeforeUnmount,
   onMounted,
   ref,
   computed,
   watch,
   toRefs,
   provide,
   readonly,
   nextTick,
   type Component,
} from 'vue'

import { usePush, type PushOptions } from 'notivue'

import { useElements, useItems } from '@/core/useStore'
import { focusableEls, keyboardInjectionKey } from './constants'
import { useKeyboard } from './useKeyboard'
import { useLastFocused } from './useLastFocused'

import type { TabIndexValue, ContainersTabIndexMap, NotivueKeyboardProps } from './types'

// Props

const props = withDefaults(defineProps<NotivueKeyboardProps>(), {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage: "You're exiting the notifications stream. Press CTRL + N to navigate it again.",
   emptyMessage: 'No notifications to navigate',
   renderAnnouncement: true,
})

const { comboKey, handleClicks, leaveMessage, emptyMessage, renderAnnouncement } = toRefs(props)

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

const elements = useElements()
const items = useItems()
const push = usePush()

// Internal State

const { focusLastElement } = useLastFocused()
const { isKeyboard } = useKeyboard()

const candidateIds = ref({ qualified: [] as string[], unqualified: [] as string[] })
const candidateContainers = ref<HTMLElement[]>([])

const elementsTabIndex = ref<TabIndexValue>(-1)

function setTabIndex(value: TabIndexValue) {
   elementsTabIndex.value = value
}

// Non-reactive

let hasNeverTabbedStream = true
let allInnerFocusableEls: HTMLElement[] = []

// Computed

const containersTabIndex = computed(() => {
   const map = {} as ContainersTabIndexMap

   candidateIds.value.qualified.forEach((id) => (map[id] = elementsTabIndex.value))
   candidateIds.value.unqualified.forEach((id) => (map[id] = -1))

   return map
})

// Provide

provide(keyboardInjectionKey, {
   containersTabIndex,
   elementsTabIndex: readonly(elementsTabIndex),
})

/* ====================================================================================
 * Candidates
 * ==================================================================================== */

watch(
   elements.containers,
   (newContainers) => {
      setCandidates(newContainers)
   },
   { deep: true }
)

function setCandidates(newContainers: HTMLElement[]) {
   let newCandidateContainers: HTMLElement[] = []
   let newInnerFocusableEls: HTMLElement[] = []

   const newIds = { qualified: [] as string[], unqualified: [] as string[] }

   newContainers
      .map((container) => ({ id: container.dataset.notivueContainer!, container }))
      .sort((a, b) => +b.id - +a.id)
      .forEach(({ id, container }) => {
         const innerFocusableEls = Array.from(container.querySelectorAll(focusableEls)).filter(
            (el) => el instanceof HTMLElement
         ) as HTMLElement[]

         newInnerFocusableEls.push(...innerFocusableEls)

         if (innerFocusableEls.length > 1) {
            newIds.qualified.push(id)
            newCandidateContainers.push(container)
         } else {
            newIds.unqualified.push(id)
         }
      })

   candidateIds.value = newIds
   candidateContainers.value = newCandidateContainers

   allInnerFocusableEls = newInnerFocusableEls
}

/* ====================================================================================
 * Entering the Stream
 * ==================================================================================== */

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

watch(
   candidateContainers,
   (currCandidates, prevCandidates, onCleanup) => {
      const hasCandidates = currCandidates.length > 0
      const isNewCandidate = currCandidates.some((container) => {
         return !prevCandidates.some((prevContainer) => prevContainer === container)
      })

      const shouldFocusFirst = isNewCandidate && items.isStreamFocused.value

      const shouldAddEnterListener =
         (isNewCandidate && !items.isStreamFocused.value) || (hasCandidates && hasNeverTabbedStream)

      if (shouldFocusFirst) {
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

/* ====================================================================================
 * Re-entering, exiting the stream
 * ==================================================================================== */

function onStreamEnter() {
   if (candidateContainers.value.length === 0) return

   setTabIndex(0)

   items.setStreamFocus()
   items.pauseTimeouts()

   nextTick(() => {
      candidateContainers.value[0].focus()
   })
}

function onStreamLeave() {
   focusLastElement()

   // State
   setTabIndex(-1)

   items.resetStreamFocus()
   items.resumeTimeouts()

   // Announce
   push.info(leavePushOptions.value)
}

/**
 * This is needed to track whether the user is leaving the stream
 * using TAB or SHIFT + TAB. In any other case, we toggle
 * the state manually.
 */
let isManualLeave = false

watch(
   elements.wrapper,
   (stream, _, onCleanup) => {
      function onStreamFocusOut(e: FocusEvent) {
         e.preventDefault()
         e.stopPropagation()

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

      if (isClickable && (e.key === ' ' || e.key === 'Enter')) {
         e.preventDefault()
         e.target.click()

         const nextContainer = candidateContainers.value[currCandidateIndex + 1]
         if (nextContainer) {
            nextContainer.focus()
         } else {
            isManualLeave = true

            return onStreamLeave()
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

      if (items.isStreamFocused.value) {
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
 * If clicking any action with a device different than the keyboard,
 * we want to resume timeouts and disable stream tabbing.
 *
 * Same if clicking any element outside the stream.
 */
function onActionsMouseClick(e: MouseEvent) {
   if (items.isStreamFocused.value && !isKeyboard.value) {
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
   items.reset()

   events.forEach(([event, handler]) => {
      document.removeEventListener(event, handler as EventListener)
   })
})
</script>

<template>
   <slot v-bind="{ containersTabIndex, elementsTabIndex }" />
</template>
./useIsKeyboard
