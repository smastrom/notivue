import { ref, shallowRef, computed, triggerRef } from 'vue'

import {
   isReducedMotion,
   mergeDeep,
   toShallowRefs,
   mergeNotificationOptions as mergeOptions,
} from './utils'

import { DEFAULT_CONFIG, NotificationTypeKeys as NKeys, TransitionType as TType } from './constants'

import type {
   DeepPartial,
   StoreItem,
   NotivueConfig,
   PushOptionsWithInternals,
   Obj,
   ConfigSlice,
   ItemsSlice,
   QueueSlice,
   ElementsSlice,
   TimeoutsSlice,
   AnimationsSlice,
} from 'notivue'
import { getSlotContext } from '@/Notivue/utils'

export function createConfigSlice(userConfig: NotivueConfig) {
   const reactiveConfig = toShallowRefs(mergeDeep(DEFAULT_CONFIG, userConfig))

   return {
      ...reactiveConfig,
      isTopAlign: computed(() => reactiveConfig.position.value.startsWith('top')),
   }
}

export function createQueueSlice() {
   return {
      entries: shallowRef<StoreItem[]>([]),
      getLength() {
         return this.entries.value.length
      },
      add(item: StoreItem) {
         this.entries.value.push(item)
         triggerRef(this.entries)
      },
      get(id: string) {
         return this.entries.value.find(({ id: _id }) => id === _id)
      },
      update(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, newOptions)
         triggerRef(this.entries)
      },
      remove(id: string) {
         this.entries.value = this.entries.value.filter(({ id: _id }) => id !== _id)
      },
      clear() {
         this.entries.value = []
      },
   }
}

export function createItemsSlice(config: ConfigSlice, queue: QueueSlice) {
   return {
      entries: shallowRef<StoreItem[]>([]),
      getLength() {
         return this.entries.value.length
      },
      add(item: StoreItem) {
         this.entries.value.unshift(item)
         triggerRef(this.entries)
      },
      addFromQueue() {
         const firstQueueItem = {
            ...queue.entries.value[0],
            timeout: (queue.entries.value[0].timeout as () => void)(),
            createdAt: Date.now(),
         }

         queue.remove(firstQueueItem.id)
         this.add(firstQueueItem)
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

         const shouldDequeue = config.enqueue.value && queue.getLength() > 0
         if (shouldDequeue) this.addFromQueue()
      },
      clear() {
         this.entries.value = []
      },
   }
}

export function createElementsSlice() {
   return {
      wrapper: ref<HTMLElement | null>(null),
      items: ref<HTMLElement[]>([]),
      containers: ref<HTMLElement[]>([]),
      getSortedItems() {
         return this.items.value.sort((a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!)
      },
   }
}

export function createAnimationsSlice(
   config: ConfigSlice,
   items: ItemsSlice,
   queue: QueueSlice,
   elements: ElementsSlice
) {
   type TransitionData = { duration: string; easing: string }

   return {
      transitionData: null as null | TransitionData,
      getTransitionData() {
         if (!this.transitionData) this.syncTransitionData()
         return this.transitionData as TransitionData
      },
      resetTransitionData() {
         this.transitionData = null
      },
      syncTransitionData() {
         const enterClass = config.animations.value.enter
         const animEl = enterClass ? elements.wrapper.value?.querySelector(`.${enterClass}`) : null

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
      playLeave(id: string, { isDestroy = false, isManual = false } = {}) {
         const currItem = items.get(id)
         const clearCallback = () =>
            currItem?.[isManual ? 'onManualClear' : 'onAutoClear']?.(getSlotContext(currItem))

         if (!config.animations.value.leave || isDestroy || isReducedMotion()) {
            items.remove(id)
            return clearCallback()
         }

         items.update(id, {
            animationClass: config.animations.value.leave,
            onAnimationend: () => {
               items.remove(id)
               clearCallback()
            },
         })

         this.updatePositions()
      },
      playClearAll() {
         if (elements.wrapper.value) {
            function onEnd() {
               items.clear()
               queue.clear()
            }

            if (!config.animations.value.clearAll || isReducedMotion()) return onEnd()

            elements.wrapper.value.classList.add(config.animations.value.clearAll)
            elements.wrapper.value.onanimationend = onEnd
         }
      },
      updatePositions(type = TType.PUSH) {
         const isReduced = isReducedMotion() || type === TType.SILENT

         let accPrevHeights = 0

         requestAnimationFrame(() => {
            const sortedItems = elements.getSortedItems()

            for (const el of sortedItems) {
               const leaveClassName = config.animations.value.leave
               const currId = el.dataset.notivueId!
               const item = items.get(currId)

               if (!el || !item || item.animationClass === leaveClassName) continue

               items.update(currId, {
                  positionStyles: {
                     transitionDuration: this.getTransitionData().duration,
                     transitionTimingFunction: this.getTransitionData().easing,
                     ...(type === TType.HEIGHT ? { transitionProperty: 'all' } : {}),
                     ...(isReduced ? { transition: 'none' } : {}),

                     transform: `translate3d(0, ${accPrevHeights}px, 0)`,
                  },
               })

               accPrevHeights += (config.isTopAlign.value ? 1 : -1) * el.clientHeight
            }
         })
      },
   }
}

export function createTimeoutsSlice(items: ItemsSlice, animations: AnimationsSlice) {
   return {
      isStreamPaused: ref(false),
      isStreamFocused: ref(false),
      setStreamPause(newValue = true) {
         this.isStreamPaused.value = newValue
      },
      setStreamFocus(newValue = true) {
         this.isStreamFocused.value = newValue
      },
      reset() {
         this.setStreamPause(false)
         this.setStreamFocus(false)
      },
      create(id: string, duration: number | undefined, { ignorePause = false } = {}) {
         if (
            duration === 0 ||
            duration === null ||
            duration === Infinity ||
            (this.isStreamPaused.value && !ignorePause)
         ) {
            return undefined
         }

         return window.setTimeout(() => animations.playLeave(id), duration)
      },
      pause() {
         if (items.getLength() === 0 || this.isStreamPaused.value) return

         const pausedAt = Date.now()

         console.log('Pausing timeouts')
         items.updateAll((item) => {
            clearTimeout(item.timeout as number)

            return {
               ...item,
               elapsed: pausedAt - (item.resumedAt ?? item.createdAt) + (item.elapsed ?? 0),
            }
         })

         this.setStreamPause()
      },
      resume() {
         if (items.getLength() === 0 || !this.isStreamPaused.value) return

         console.log('Resuming timeouts')
         items.updateAll((item) => {
            clearTimeout(item.timeout as number)
            /**
             * 'elapsed' may be equal to 'undefined' if a notification
             * is pushed while the stream is paused as pause() won't be called.
             *
             * To keep leave animation order coherent with the creation time and to avoid
             * notifications to be dismissed at the same time, we calculate a normalized
             * elapsed time ranging from 200ms to 1200ms.
             */
            if (item.elapsed === undefined) {
               const createdAtStamps = items.entries.value.map(({ createdAt }) => createdAt)

               const maxStamp = Math.max(...createdAtStamps)
               const minStamp = Math.min(...createdAtStamps)

               if (minStamp === maxStamp) {
                  item.elapsed = 1200
               } else {
                  const normalizedCreatedAt = (item.createdAt - minStamp) / (maxStamp - minStamp)
                  item.elapsed = normalizedCreatedAt * (1200 - 200) + 200
               }
            }

            return {
               ...item,
               resumedAt: Date.now(),
               timeout: this.create(item.id, item.duration - item.elapsed, { ignorePause: true }),
            }
         })

         this.setStreamPause(false)
      },
   }
}

export function createProxiesSlice(
   config: ConfigSlice,
   items: ItemsSlice,
   queue: QueueSlice,
   animations: AnimationsSlice,
   timeouts: TimeoutsSlice
) {
   return {
      /**
       * Removes a notification and resumes timeouts if clearing the last one.
       * This is only used by users (push.clear).
       */
      clear(id: string, { isDestroy = false } = {}) {
         const isLast = items.getLength() > 1 && items.entries.value.at(-1)?.id === id
         if (isLast) timeouts.resume()

         animations.playLeave(id, { isManual: true, isDestroy })
      },
      /**
       * Creates, updates or enqueues a notification created using push methods
       */
      push<T extends Obj = Obj>(options: PushOptionsWithInternals<T>) {
         const createdAt = Date.now()

         const entry = mergeOptions<T>(config.notifications.value, options)

         const isQueueActive = config.enqueue.value
         const isUpdate = [NKeys.PROMISE_RESOLVE, NKeys.PROMISE_REJECT].includes(options.type)

         const createTimeout = () => timeouts.create(entry.id, entry.duration)

         console.log(isUpdate, queue.entries.value)

         if (isUpdate) {
            if (isQueueActive && queue.get(entry.id)) {
               console.log('Updating queue item from push()')
               queue.update(entry.id, { ...entry, createdAt, timeout: createTimeout })
            } else {
               console.log('Updating item from push()')
               items.update(entry.id, { ...entry, createdAt, timeout: createTimeout() })
            }
         } else {
            const hasReachedLimit = items.getLength() >= config.limit.value
            const shouldDiscard = !isQueueActive && hasReachedLimit

            if (shouldDiscard) {
               const exceedingItems = items.entries.value.slice(config.limit.value - 1)
               exceedingItems.forEach(({ id }) => timeouts.create(id, 10))
            }

            const shouldEnqueue =
               isQueueActive && !options.skipQueue && (queue.getLength() > 0 || hasReachedLimit)

            const item = {
               ...entry,
               createdAt,
               animationClass: isReducedMotion() ? '' : config.animations.value.enter,
               timeout: shouldEnqueue ? createTimeout : createTimeout(),
               clear: () => this.clear(entry.id),
               destroy: () => this.clear(entry.id, { isDestroy: true }),
            } as StoreItem<T>

            if (shouldEnqueue) {
               console.log('Enqueuing')
               queue.add(item)
            } else {
               items.add(item)
               animations.updatePositions()
            }
         }
      },
   }
}
