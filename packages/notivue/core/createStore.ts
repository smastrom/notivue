import { ref, shallowRef, triggerRef, type InjectionKey } from 'vue'

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
      paused: ref(false),
      reset() {
         this.clearItems()
         this.clearQueue()
         this.paused.value = false
      },
      /* ====================================================================================
       * Core Methods
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
      update(id: string, options: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, options)
         triggerRef(this.entries)
      },
      updateAll(updateItem: (item: StoreItem) => StoreItem) {
         this.entries.value = this.entries.value.map(updateItem)
      },
      remove(id: string) {
         const isLast = id === this.entries.value[this.entries.value.length - 1].id
         if (isLast && (config.pauseOnHover.value || config.pauseOnTouch.value)) {
            this.resumeTimeouts()
         }

         this.entries.value = this.entries.value.filter(({ timeout, id: _id }) => {
            if (id !== _id) return true
            return clearTimeout(timeout as number), false
         })

         if (config.enqueue.value && this.queue.value.length > 0) this.addFromQueue()
         if (this.entries.value.length === 0) this.reset()
      },
      clearItems() {
         this.entries.value = []
      },
      /* ====================================================================================
       * Queue Methods
       * ==================================================================================== */
      addToQueue(item: StoreItem) {
         this.queue.value.push(item)
         triggerRef(this.queue)
      },
      addFromQueue() {
         const nextItem = {
            ...this.queue.value[0],
            timeout: (this.queue.value[0].timeout as () => void)(),
            createdAt: Date.now(),
         }

         this.add(nextItem)
         this.removeFromQueue(nextItem.id)
      },
      removeFromQueue(id: string) {
         this.queue.value = this.queue.value.filter(({ id: _id }) => id !== _id)
      },
      clearQueue() {
         this.queue.value = []
      },
      /* ====================================================================================
       * Push proxy - Creates, updates or enqueues a pushed notification
       * ==================================================================================== */
      pushProxy<T extends Obj = Obj>(incomingOptions: UserPushOptionsWithInternals<T>) {
         const createdAt = Date.now()
         const entry = mergeOptions<T>(config.notifications.value, incomingOptions)

         const createTimeout = () => {
            if (entry.duration === Infinity || this.paused.value) return undefined
            return window.setTimeout(() => this.addLeaveClass(entry.id), entry.duration)
         }

         if ([NKeys.PROMISE_REJECT, NKeys.PROMISE_RESOLVE].includes(incomingOptions.type)) {
            this.update(entry.id, { ...entry, createdAt, timeout: createTimeout() })
         } else {
            const isQueueActive = config.enqueue.value
            const hasEnqueuedItems = this.queue.value.length > 0
            const hasReachedLimit = this.entries.value.length >= config.limit.value
            const isNotPromise = entry.type !== NKeys.PROMISE

            const shouldEnqueue =
               isQueueActive && isNotPromise && (hasEnqueuedItems || hasReachedLimit)

            if (!isQueueActive && hasReachedLimit) {
               const exceedingItems = this.entries.value.slice(config.limit.value - 1)
               exceedingItems.forEach(({ id }) => this.addLeaveClass(id))
            }

            const item = {
               ...entry,
               createdAt,
               timeout: shouldEnqueue ? createTimeout : createTimeout(),
               clear: () => this.addLeaveClass(entry.id),
               destroy: () => this.remove(entry.id),
            } as StoreItem<T>

            if (shouldEnqueue) {
               this.addToQueue(item)
            } else {
               this.add(item)
            }
         }
      },
      /* ====================================================================================
       * Timeouts
       * ==================================================================================== */
      pauseTimeouts() {
         if (this.entries.value.length === 0 || this.paused.value) return

         const pausedAt = Date.now()

         this.updateAll((item) => {
            clearTimeout(item.timeout as number)

            console.log('Pause timeouts -', 'Prev elapsed:', item.elapsed)
            console.log(
               'Pause timeouts -',
               'New elapsed:',
               pausedAt - (item.resumedAt ?? item.createdAt) + (item.elapsed ?? 0)
            )
            console.log('- - - - - - - - - - - - - -')

            return {
               ...item,
               elapsed: pausedAt - (item.resumedAt ?? item.createdAt) + (item.elapsed ?? 0),
            }
         })

         this.paused.value = true
      },
      resumeTimeouts() {
         if (this.entries.value.length === 0 || !this.paused.value) return

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

            console.log('Resume timeouts -', 'Elapsed:', item.elapsed)
            console.log('Resume timeouts -', 'New timeout:', item.duration - item.elapsed)
            console.log('- - - - - - - - - - - - - -')

            return {
               ...item,
               resumedAt: Date.now(),
               timeout:
                  item.duration === Infinity
                     ? undefined
                     : window.setTimeout(() => this.addLeaveClass(item.id), newTimeout),
            }
         })

         this.paused.value = false
      },
      /* ====================================================================================
       * Animations - Classes
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

         this.updateClass(id, config.animations.value.enter)
         items.updatePositions()
      },
      addLeaveClass(id: string) {
         if (!config.animations.value.leave || isReducedMotion()) return this.remove(id)

         this.updateClass(id, config.animations.value.leave, () => this.remove(id))
         items.updatePositions()
      },
      /* ====================================================================================
       * Transitions - Styles
       * ==================================================================================== */
      updatePositions(type = TType.PUSH) {
         const sortedItems = elements.getSortedItems()
         const isReduced = isReducedMotion() || type === TType.SILENT

         let accPrevHeights = 0

         for (const el of sortedItems) {
            const currId = el.dataset.notivueId!
            const item = this.get(currId)

            if (!el || !item || item.animationClass === config.animations.value.leave) {
               continue
            }

            this.update(currId, {
               transitionStyles: {
                  transitionDuration: elements.getTransitionData()!.duration,
                  transitionTimingFunction: elements.getTransitionData()!.easing,
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
      getSortedItems() {
         return elements.items.value.sort((a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!)
      },
      /* ====================================================================================
       * Transition data
       * ==================================================================================== */
      transitionData: null as null | { duration: string; easing: string },
      getTransitionData() {
         if (!this.transitionData) this.syncTransitionData()
         return this.transitionData
      },
      syncTransitionData() {
         const animEl = this.wrapper.value?.querySelector(`.${config.animations.value.enter}`)

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
      /* ====================================================================================
       * Imperative animations
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

   return { config, elements, items, push }
}
