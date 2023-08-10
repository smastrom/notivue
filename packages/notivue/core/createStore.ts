import { nextTick, ref, shallowRef, triggerRef, watch, type InjectionKey } from 'vue'

import { getConfig } from './config'
import { mergeNotificationOptions as mergeOptions } from './options'
import { createPush } from './createPush'
import { isReducedMotion } from './utils'

import { NotificationTypeKeys as NKeys, TransitionType as TType } from './constants'

import type {
   DeepPartial,
   StoreItem,
   NotivueConfig,
   UserPushOptionsWithInternals,
   Obj,
} from 'notivue'

export const storeInjectionKey = Symbol('') as InjectionKey<ReturnType<typeof createStore>>

export function createStore(userConfig: NotivueConfig) {
   const config = getConfig(userConfig)

   const items = {
      entries: shallowRef<StoreItem[]>([]),
      queue: shallowRef<StoreItem[]>([]),
      isStreamPaused: ref(false),
      isStreamFocused: ref(false),
      /* ====================================================================================
       * UI Methods and Reset
       * ==================================================================================== */
      resetPause() {
         this.isStreamPaused.value = false
      },
      setStreamFocus() {
         this.isStreamFocused.value = true
      },
      resetStreamFocus() {
         this.isStreamFocused.value = false
      },
      reset() {
         this.clearItems()
         this.clearQueue()
         this.resetPause()
         this.resetStreamFocus()
      },
      /* ====================================================================================
       * Active items methods
       * ==================================================================================== */
      add(item: StoreItem) {
         this.entries.value.unshift(item)
         triggerRef(this.entries)

         this.addEnterClass(item.id)
         items.updatePositions()
      },
      get(id: string) {
         return this.entries.value.find(({ id: _id }) => id === _id)
      },
      update(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, newOptions)
         triggerRef(this.entries)
      },
      updateAll(updateItem: (item: StoreItem) => StoreItem) {
         this.entries.value = this.entries.value.map(updateItem)
      },
      remove(id: string) {
         this.entries.value = this.entries.value.filter(({ timeout, id: _id }) => {
            if (id !== _id) return true
            return clearTimeout(timeout as number), false
         })

         const shouldDequeue = config.enqueue.value && this.queue.value.length > 0
         if (shouldDequeue) this.addFromQueue()
      },
      clearItems() {
         this.entries.value = []
      },
      /* ====================================================================================
       * Queued items methods
       * ==================================================================================== */
      addQueueItem(item: StoreItem) {
         this.queue.value.push(item)
         triggerRef(this.queue)
      },
      getQueueItem(id: string) {
         return this.queue.value.find(({ id: _id }) => id === _id)
      },
      updateQueueItem(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.getQueueItem(id) ?? {}, newOptions)
         triggerRef(this.queue)
      },
      removeQueueItem(id: string) {
         this.queue.value = this.queue.value.filter(({ id: _id }) => id !== _id)
      },
      addFromQueue() {
         const firstQueueItem = {
            ...this.queue.value[0],
            timeout: (this.queue.value[0].timeout as () => void)(),
            createdAt: Date.now(),
         }

         nextTick(() => {
            this.removeQueueItem(firstQueueItem.id)
            this.add(firstQueueItem)
         })
      },
      clearQueue() {
         this.queue.value = []
      },
      /* ====================================================================================
       * Push Proxy - Creates, updates or enqueues a notification created using push methods
       * ==================================================================================== */
      pushProxy<T extends Obj = Obj>(incomingOptions: UserPushOptionsWithInternals<T>) {
         const createdAt = Date.now()
         const entry = mergeOptions<T>(config.notifications.value, incomingOptions)
         const isQueueActive = config.enqueue.value

         const createTimeout = () => {
            if (entry.duration === Infinity || this.isStreamPaused.value) return undefined
            return window.setTimeout(() => this.addLeaveClass(entry.id), entry.duration)
         }

         if ([NKeys.PROMISE_REJECT, NKeys.PROMISE_RESOLVE].includes(incomingOptions.type)) {
            if (isQueueActive && this.getQueueItem(entry.id)) {
               this.updateQueueItem(entry.id, { ...entry, createdAt, timeout: createTimeout })
            } else {
               this.update(entry.id, { ...entry, createdAt, timeout: createTimeout() })
            }
         } else {
            const hasReachedLimit = this.entries.value.length >= config.limit.value
            const shouldDiscard = !isQueueActive && hasReachedLimit

            if (shouldDiscard) {
               const exceedingItems = this.entries.value.slice(config.limit.value - 1)
               exceedingItems.forEach(({ id }) => window.setTimeout(() => this.addLeaveClass(id)))
            }

            const hasEnqueuedItems = this.queue.value.length > 0
            const shouldEnqueue = isQueueActive && (hasEnqueuedItems || hasReachedLimit)

            const item = {
               ...entry,
               createdAt,
               timeout: shouldEnqueue ? createTimeout : createTimeout(), // Will be called when dequeued
               clear: () => this.addLeaveClass(entry.id),
               destroy: () => this.remove(entry.id),
            } as StoreItem<T>

            if (shouldEnqueue) {
               this.addQueueItem(item)
            } else {
               this.add(item)
            }
         }
      },
      /* ====================================================================================
       * Timeouts
       * ==================================================================================== */
      pauseTimeouts() {
         if (this.entries.value.length === 0) return
         if (this.isStreamPaused.value) return

         const pausedAt = Date.now()

         console.log('Pausing timeouts')
         this.updateAll((item) => {
            clearTimeout(item.timeout as number)

            return {
               ...item,
               elapsed: pausedAt - (item.resumedAt ?? item.createdAt) + (item.elapsed ?? 0),
            }
         })

         this.isStreamPaused.value = true
      },
      resumeTimeouts() {
         if (this.entries.value.length === 0) return
         if (!this.isStreamPaused.value) return

         console.log('Resuming timeouts')
         this.updateAll((item) => {
            clearTimeout(item.timeout as number)
            /**
             * 'elapsed' may be equal to 'undefined' if a notification
             * is pushed while the stream is paused as 'pausedTimeouts' won't be called.
             *
             * To keep leave animation order coherent with the creation time and to avoid
             * notifications to be dismissed at the same time, we calculate a normalized
             * elapsed time ranging from 200ms to 1200ms.
             */
            if (item.elapsed === undefined) {
               const createdAtStamps = this.entries.value.map(({ createdAt }) => createdAt)

               const maxStamp = Math.max(...createdAtStamps)
               const minStamp = Math.min(...createdAtStamps)

               if (minStamp === maxStamp) {
                  item.elapsed = 1200
               } else {
                  const normalizedCreatedAt = (item.createdAt - minStamp) / (maxStamp - minStamp)
                  item.elapsed = normalizedCreatedAt * (1200 - 200) + 200
               }
            }

            let newTimeout = item.duration - item.elapsed

            return {
               ...item,
               resumedAt: Date.now(),
               timeout:
                  item.duration === Infinity
                     ? undefined
                     : window.setTimeout(() => this.addLeaveClass(item.id), newTimeout),
            }
         })

         this.isStreamPaused.value = false
      },
      /* ====================================================================================
       * Reactive Classes - Animations
       * ==================================================================================== */
      updateClass(id: string, animationClass: string | undefined, onEnd = () => {}) {
         if (!animationClass) return onEnd()

         this.update(id, {
            animationClass,
            onAnimationstart: (event: AnimationEvent) => event.stopPropagation(),
            onAnimationend: (event: AnimationEvent) => {
               event.stopPropagation()
               onEnd()
            },
         })
      },
      addEnterClass(id: string) {
         if (isReducedMotion()) return // Will be positioned by setPositions...

         this.updateClass(id, config.animations.value.enter) // ...same if class is undefined
         items.updatePositions()
      },
      addLeaveClass(id: string) {
         if (isReducedMotion()) return this.remove(id)

         this.updateClass(id, config.animations.value.leave, () => this.remove(id))
         items.updatePositions()
      },
      /* ====================================================================================
       * Reactive Styles - Positions
       * ==================================================================================== */
      updatePositions(type = TType.PUSH) {
         const sortedItems = elements.getSortedItems()
         const isReduced = isReducedMotion() || type === TType.SILENT

         let accPrevHeights = 0

         for (const el of sortedItems) {
            const leaveClassName = config.animations.value.leave
            const currId = el.dataset.notivueId!
            const item = this.get(currId)

            if (!el || !item || item.animationClass === leaveClassName) {
               continue
            }

            this.update(currId, {
               positionStyles: {
                  transitionDuration: elements.getTransitionData().duration,
                  transitionTimingFunction: elements.getTransitionData().easing,
                  ...(type === TType.HEIGHT ? { transitionProperty: 'all' } : {}),
                  ...(isReduced ? { transition: 'none' } : {}),

                  transform: `translate3d(0, ${accPrevHeights}px, 0)`,
               },
            })

            accPrevHeights += (config.isTopAlign.value ? 1 : -1) * el.clientHeight
         }
      },
   }

   const elements = {
      wrapper: ref<HTMLElement | null>(null),
      items: ref<HTMLElement[]>([]),
      containers: ref<HTMLElement[]>([]),
      getSortedItems() {
         return this.items.value.sort((a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!)
      },
      /* ====================================================================================
       * Transition data
       * ==================================================================================== */
      transitionData: null as null | { duration: string; easing: string },
      getTransitionData() {
         if (!this.transitionData) this.syncTransitionData()
         return this.transitionData as { duration: string; easing: string }
      },
      syncTransitionData() {
         const enterClass = config.animations.value.enter
         const animEl = enterClass ? this.wrapper.value?.querySelector(`.${enterClass}`) : null

         if (!animEl) {
            this.transitionData = { duration: '0s', easing: 'ease' }
         } else {
            const style = getComputedStyle(animEl)

            this.transitionData = {
               duration: style.animationDuration,
               easing: style.animationTimingFunction,
            }
         }
      },
      resetTransitionData() {
         this.transitionData = null
      },
      /* ====================================================================================
       * Imperative Classes - Animations
       * ==================================================================================== */
      addClearAllClass() {
         if (this.wrapper.value) {
            if (!config.animations.value.clearAll || isReducedMotion()) return items.reset()

            this.wrapper.value.classList.add(config.animations.value.clearAll)
            this.wrapper.value.onanimationend = () => items.reset()
         }
      },
   }

   const push = createPush(items, elements)

   // Side effects

   watch(
      () => [config.enqueue.value, config.limit.value, config.teleportTo.value],
      () => items.reset(),
      { flush: 'sync' }
   )

   watch(
      () => items.entries.value.length === 0 && items.queue.value.length === 0,
      () => {
         console.log('Reset from watcher!')

         elements.resetTransitionData()
         items.resetPause()
         items.resetStreamFocus()
      }
   )

   return {
      config,
      elements,
      items,
      push,
   }
}
