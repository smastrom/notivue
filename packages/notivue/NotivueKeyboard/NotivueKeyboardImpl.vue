<script setup lang="ts">
import type { NotifyOptions, NotivueKeyboardProps, NotivueKeyboardSlot } from 'notivue'

import { onBeforeUnmount, onMounted, ref, computed, toRefs, nextTick, watch } from 'vue'

import { notify } from '@/core/createNotify'
import { useNotivue, useStore } from '@/core/useStore'

import { focusableEls, DEFAULT_PROPS } from './constants'

import { useKeyboardFocus } from './useKeyboardFocus'
import { useLastFocused } from './useLastFocused'

// Props

const props = withDefaults(defineProps<NotivueKeyboardProps>(), DEFAULT_PROPS)

const { comboKey, handleClicks, leaveMessage, emptyMessage, renderAnnouncement, maxAnnouncements } =
   toRefs(props)

// Slots

defineSlots<NotivueKeyboardSlot>()

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

const leaveNotifyOptions = computed<NotifyOptions>(() => ({
   message: leaveMessage.value,
   ...sharedOptions,
}))

const emptyNotifyOptions = computed<NotifyOptions>(() => ({
   message: emptyMessage.value,
   ...sharedOptions,
}))

// Store

const { elements, timeouts, queue, items } = useStore()

const config = useNotivue()

/* ====================================================================================
 * Internal state
 * ==================================================================================== */

const { focusLastElement } = useLastFocused()
const { isKeyboardFocus } = useKeyboardFocus()

const candidateItems = ref<HTMLElement[]>([])
const unqualifiedItems = ref<HTMLElement[]>([])

function setItemsTabIndex(value: 0 | -1) {
   candidateItems.value.forEach((item) => (item.tabIndex = value))
}

// Non-reactive

let announcementsCount = 0

let hasNeverTabbedStream = true
let allInnerFocusableEls: HTMLElement[] = []

// Actions

function onStreamEnter() {
   if (candidateItems.value.length === 0) return

   setItemsTabIndex(0)

   timeouts.setStreamFocus()
   timeouts.pause()

   nextTick(() => {
      candidateItems.value[0].focus()
   })
}

function onStreamLeave({ announce = true } = {}) {
   focusLastElement()

   setItemsTabIndex(-1)

   timeouts.setStreamFocus(false)
   timeouts.resume()

   if (announce && announcementsCount < maxAnnouncements.value) {
      announcementsCount++

      notify.info(leaveNotifyOptions.value)
   }
}

/* ====================================================================================
 * Collect candidates/unqualified
 * ==================================================================================== */

watch(elements.items, setCandidates, { deep: true })

function setCandidates(newItems: HTMLElement[]) {
   let _candidateItems: HTMLElement[] = []
   let _unqualifiedItems: HTMLElement[] = []

   let _focusableEls: HTMLElement[] = []

   newItems
      .filter((item) => {
         const id = item.dataset.notivueListItem

         if (!id) return false

         const entry = items.get(id)

         return Boolean(entry && !entry.ariaLiveOnly)
      })
      .sort((a, b) => +b.dataset.notivueListItem! - +a.dataset.notivueListItem!)
      .forEach((item) => {
         const innerFocusableEls = Array.from(item.querySelectorAll(focusableEls)).filter(
            (el) => el instanceof HTMLElement
         ) as HTMLElement[]

         _focusableEls.push(...innerFocusableEls)

         const isQualified = innerFocusableEls.length > 0 || props.isCandidate?.(item) === true

         if (isQualified) {
            item.tabIndex = timeouts.isStreamFocused.value ? 0 : -1

            _candidateItems.push(item)
         } else {
            item.tabIndex = -1

            _unqualifiedItems.push(item)
         }
      })

   candidateItems.value = _candidateItems
   unqualifiedItems.value = _unqualifiedItems

   allInnerFocusableEls = _focusableEls
}

/* ====================================================================================
 * On new candidates-push behavior (enter the stream or focus the first)
 * ==================================================================================== */

watch(
   candidateItems,
   (currCandidates, prevCandidates, onCleanup) => {
      if (currCandidates.length === 0) return

      const hasCandidates = currCandidates.length > 0
      const isNewCandidate = currCandidates.some((item) => {
         return !prevCandidates.some((prevItem) => prevItem === item)
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
   if (!e.shiftKey && e.key === 'Tab' && candidateItems.value.length > 0) {
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
   unqualifiedItems,
   (newUnqualified) => {
      if (!config.enqueue.value || !timeouts.isStreamFocused.value) return

      if (newUnqualified.length > 0) {
         if (candidateItems.value.length > 0) {
            candidateItems.value[0].focus()
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
   elements.root,
   (stream, _, onCleanup) => {
      function onStreamFocusOut(e: FocusEvent) {
         e.preventDefault()
         e.stopPropagation()

         if (!timeouts.isStreamFocused.value) return
         if (!isKeyboardFocus.value) return

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

   const isNavigatingCandidates = candidateItems.value.some((item, index) => {
      if (item.contains(e.target as HTMLElement) || item === e.target) {
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
         if (queue.length > 0) return

         const nextItem =
            candidateItems.value[currCandidateIndex + 1] ??
            candidateItems.value[currCandidateIndex - 1]

         if (nextItem) {
            nextItem.focus()
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
         if (candidateItems.value.length > 0) {
            onStreamEnter()
         } else {
            notify.info(emptyNotifyOptions.value)
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
   if (timeouts.isStreamFocused.value && !isKeyboardFocus.value) {
      if (!elements.root.value?.contains(e.target as HTMLElement)) {
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
   events.forEach(([event, handler]) => document.addEventListener(event, handler as EventListener))
})

onBeforeUnmount(() => {
   events.forEach(([event, handler]) => {
      document.removeEventListener(event, handler as EventListener)
   })
})
</script>

<template>
   <slot />
</template>
