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
   watchEffect,
   type Component,
} from 'vue'

import { usePush, type PushOptions } from 'notivue'

import { useElements, useItems } from '@/core/useStore'
import { focusableEls, keyboardInjectionKey } from './constants'
import { useFocusDevice } from './useFocusDevice'

import type { TabIndexValue, ContainerTabIndexMap, NotivueKeyboardProps } from './types'

// Props

const props = withDefaults(defineProps<NotivueKeyboardProps>(), {
   comboKey: 'n',
   handleClicks: true,
   leaveMessage: "You're exiting the notifications stream. Press CTRL + N to navigate it again.",
   emptyMessage: 'No notifications to navigate',
})

const { comboKey, handleClicks, leaveMessage, emptyMessage } = toRefs(props)

// Slots

defineSlots<{
   default(props: { tabIndex: 0 | -1; containersTabIndex: ContainerTabIndexMap }): Component
}>()

// Computed

const sharedOptions = {
   ariaRole: 'alert',
   ariaLive: 'assertive',
   skipQueue: true,
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

const { isKeyboard } = useFocusDevice()

const candidateIds = ref({ qualified: [] as string[], unqualified: [] as string[] })
const candidateContainers = ref<HTMLElement[]>([])

const tabIndex = ref<TabIndexValue>(-1)

function setTabIndex(value: TabIndexValue) {
   tabIndex.value = value
}

// Computed

const containersTabIndex = computed(() => {
   const map = {} as ContainerTabIndexMap

   candidateIds.value.qualified.forEach((id) => (map[id] = tabIndex.value))
   candidateIds.value.unqualified.forEach((id) => (map[id] = -1))

   return map
})

// Provide

provide(keyboardInjectionKey, {
   containersTabIndex,
   tabIndex: readonly(tabIndex),
})

// Non-Reactive

let relatedTarget: HTMLElement | null = null
let lastElement: HTMLElement | null = null

/* ====================================================================================
 * Candidates
 * ==================================================================================== */

function setCandidates(newContainers: HTMLElement[]) {
   let newCandidateContainers: HTMLElement[] = []

   const newIds = { qualified: [] as string[], unqualified: [] as string[] }

   newContainers
      .map((container) => ({ id: container.dataset.notivueContainer!, container }))
      .sort((a, b) => +b.id - +a.id)
      .forEach(({ id, container }) => {
         const innerFocusableEls = Array.from(container.querySelectorAll(focusableEls)).filter(
            (el) => el instanceof HTMLElement
         ) as HTMLElement[]

         if (innerFocusableEls.length > 1) {
            newIds.qualified.push(id)
            newCandidateContainers.push(container)

            lastElement = innerFocusableEls.at(-1) as HTMLElement
         } else {
            newIds.unqualified.push(id)
         }
      })

   candidateIds.value = newIds
   candidateContainers.value = newCandidateContainers
}

/* ====================================================================================
 * Event Handlers
 * ==================================================================================== */

if (import.meta.env.DEV) {
   watchEffect(() => {
      const table = [
         {
            isKeyboard: isKeyboard.value,
            'items.isStreamFocused': items.isStreamFocused.value,
            tabIndex: tabIndex.value,
         },
      ]
      console.table(table)
   })
}

/**
 * Tracks if the stream is focused or not by both keyboard and pointer events.
 * Informs the store, pauses timeouts and updates internal reactivity.
 *
 * By design we want that the user is able to:
 *
 * ENTER the stream by:
 *
 * 1. Pressing Ctrl+N
 * 2. Pressing Tab when a new candidate is pushed
 *
 * EXIT the stream by:
 *
 * 1. Pressing Esc
 * 2. Pressing again Ctrl+N
 *
 * 3. Pressing Shift+Tab on FIRST focusable of the stream
 * 4. Pressing Tab on LAST focusable element of the stream
 *
 * 5. Clicking any focusable element outside the stream
 *
 * This callback is fired in any of the above cases before keydown,
 * pointer and focus events, also if using devices different than keyboard.
 */

function trackStreamFocus(event: FocusEvent) {
   const stream = elements.wrapper.value
   if (!stream) return

   if (event.type === 'focusout') {
      const { target: source, relatedTarget: destination } = event

      /**
       * We consider any child of the stream as a valid reason to enter/exit
       * it. When using custom components that do not have actions, their z-index
       * should be set to -1 by the user so this won't be fired in any case.
       */
      if (!stream.contains(source as Node) && stream.contains(destination as Node)) {
         if (!isKeyboard.value) return // Do not enter if not keyboard

         console.log('------------------------> Entering stream')
         relatedTarget = source as HTMLElement // Update releated target

         items.setStreamFocus()
         items.pauseTimeouts()
         setTabIndex(0)
      }
   } else {
      const { target: destination, relatedTarget: source } = event

      if (stream.contains(source as Node) && !stream.contains(destination as Node)) {
         console.log('------------------------> Exiting stream')

         items.resetStreamFocus()
         items.resumeTimeouts()
         setTabIndex(-1)

         push.info(leavePushOptions.value)
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
         relatedTarget?.focus()
      } else {
         if (candidateContainers.value.length > 0) {
            candidateContainers.value[0].focus()
         } else {
            push.info(emptyPushOptions.value)
         }
      }
   }
}

function onActivatedStreamNavigation(e: KeyboardEvent) {
   if (!e.shiftKey && e.key === 'Tab' && candidateContainers.value.length > 0) {
      e.preventDefault()

      relatedTarget = document.activeElement as HTMLElement // Update releated target
      candidateContainers.value[0].focus() // Focus first candidate
   }
}

function onCandidatesKeydown(e: KeyboardEvent) {
   let currCandidateIndex = 0
   const isNavigatingCandidates = candidateContainers.value.some((container, index) => {
      if (container.contains(e.target as HTMLElement) || container === e.target) {
         currCandidateIndex = index
         return true
      }
   })

   if (isNavigatingCandidates) {
      function onStreamLeave() {
         relatedTarget?.focus()
      }

      const isFirstElement = candidateContainers.value[0] === e.target
      const isLastElement = lastElement === e.target
      const isLeavingStream =
         (e.shiftKey && e.key === 'Tab' && isFirstElement) ||
         (!e.shiftKey && e.key === 'Tab' && isLastElement)

      if (isLeavingStream) {
         e.preventDefault()
         onStreamLeave()
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
            onStreamLeave()
         }
      }

      if (e.key === 'Escape') {
         e.preventDefault()
         onStreamLeave()
      }
   }
}

/* ====================================================================================
 * Lifecycle / Watchers
 * ==================================================================================== */

watch(
   elements.containers,
   (newContainers) => {
      setCandidates(newContainers)
   },
   { deep: true }
)

watch(
   candidateContainers,
   (currCandidates, prevCandidates, onCleanup) => {
      const isNewCandidate = currCandidates.some((container) => {
         return !prevCandidates.some((prevContainer) => prevContainer === container)
      })

      if (isNewCandidate) {
         if (items.isStreamFocused.value) {
            currCandidates[0].focus()
         } else {
            document.addEventListener('keydown', onActivatedStreamNavigation, { once: true })
         }
      }

      onCleanup(() => {
         if (isNewCandidate && !items.isStreamFocused.value) {
            document.removeEventListener('keydown', onActivatedStreamNavigation)
         }
      })
   },
   { flush: 'post' }
)

const events = [
   ['focusin', trackStreamFocus],
   ['focusout', trackStreamFocus],
   ['keydown', onCandidatesKeydown],
   ['keydown', onComboKeyDown],
] as const

onMounted(() => {
   events.forEach(([event, handler]) => document.addEventListener(event, handler as EventListener))
})

onBeforeUnmount(() => {
   items.reset()

   events.forEach(([event, handler]) => {
      document.removeEventListener(event, handler as EventListener)
   })
})
</script>

<template>
   <slot v-bind="{ containersTabIndex, tabIndex }" />
</template>
