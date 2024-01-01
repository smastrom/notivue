import { ref, shallowRef, computed, triggerRef, nextTick, type Ref } from 'vue'

import {
   createRefs,
   mergeDeep,
   mergeNotificationOptions as mergeOptions,
   toRawConfig,
} from './utils'
import { getSlotContext } from '@/Notivue/utils'

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
   UpdateParam,
} from 'notivue'

export function createConfig(userConfig: NotivueConfig) {
   const config = createRefs(DEFAULT_CONFIG, userConfig)
   const isTopAlign = computed(() => config.position.value.startsWith('top'))

   function update(newConfig: UpdateParam) {
      if (typeof newConfig === 'function') newConfig = newConfig(toRawConfig(config))

      for (const key of Object.keys(newConfig) as (keyof NotivueConfig)[]) {
         if (typeof config[key].value === 'object') {
            config[key].value = mergeDeep(config[key].value, newConfig[key] as any)
         } else {
            config[key].value = newConfig[key] as any
         }
      }
   }

   return { ...config, isTopAlign, update }
}

export function createQueue() {
   return {
      entries: shallowRef<StoreItem[]>([]),
      get length() {
         return this.entries.value.length
      },
      add(item: StoreItem) {
         this.entries.value.push(item)
         this.triggerRef()
      },
      get(id: string) {
         return this.entries.value.find(({ id: _id }) => id === _id)
      },
      update(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, newOptions)
      },
      triggerRef() {
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

export function createItems(config: ConfigSlice, queue: QueueSlice) {
   return {
      entries: shallowRef<StoreItem[]>([]),
      get length() {
         return this.entries.value.length
      },
      add(item: StoreItem) {
         this.entries.value.unshift(item)
         this.triggerRef()
      },
      addFromQueue() {
         const next = {
            ...queue.entries.value[0],
            timeout: (queue.entries.value[0].timeout as () => void)(),
            createdAt: Date.now(),
         }

         queue.remove(next.id)
         this.add(next)
      },
      get(id: string) {
         return this.entries.value.find(({ id: _id }) => id === _id)
      },
      update(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, newOptions)
      },
      triggerRef() {
         triggerRef(this.entries)
      },
      updateAll(updateItem: (item: StoreItem) => StoreItem) {
         this.entries.value = this.entries.value.map(updateItem)
      },
      remove(id: string) {
         this.entries.value = this.entries.value.filter(({ timeout, id: _id }) => {
            if (id !== _id) return true
            return window.clearTimeout(timeout as number), false
         })

         const shouldDequeue = queue.length > 0 && this.length < config.limit.value
         if (shouldDequeue) {
            nextTick(() => this.addFromQueue())
         }
      },
      clear() {
         this.entries.value = []
         queue.clear()
      },
   }
}

export function createElements(): {
   root: Ref<HTMLElement | null>
   rootAttrs: Ref<Partial<{ class: string; onAnimationend: () => void }>>
   setRootAttrs: (newAttrs: Partial<{ class: string; onAnimationend: () => void }>) => void
   items: Ref<HTMLElement[]>
   getSortedItems: () => HTMLElement[]
   containers: Ref<HTMLElement[]>
} {
   return {
      root: ref(null),
      rootAttrs: shallowRef({}),
      setRootAttrs(newAttrs) {
         this.rootAttrs.value = newAttrs
      },
      items: ref([]),
      getSortedItems() {
         // This is a bit dirty, but it's better than cloning and reversing the array on every repositioning
         return this.items.value.sort((a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!)
      },
      containers: ref([]),
   }
}

export function createAnimations(config: ConfigSlice, items: ItemsSlice, elements: ElementsSlice) {
   type TransitionData = { duration: string; easing: string }

   return {
      isReducedMotion: ref(false),
      transitionData: null as null | TransitionData,
      setReducedMotion(newVal: boolean) {
         this.isReducedMotion.value = newVal
      },
      getTransitionData() {
         if (!this.transitionData) this.setTransitionData()
         return this.transitionData as TransitionData
      },
      resetTransitionData() {
         this.transitionData = null
      },
      setTransitionData() {
         const enterClass = config.animations.value.enter
         const animEl = enterClass ? elements.root.value?.querySelector(`.${enterClass}`) : null

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
         const item = items.get(id)

         const { leave = '' } = config.animations.value

         function onAnimationend() {
            items.remove(id)
            item?.[isManual ? 'onManualClear' : 'onAutoClear']?.(getSlotContext(item))
         }

         if (!item || !leave || isDestroy || this.isReducedMotion.value) return onAnimationend()

         items.update(id, {
            positionStyles: {
               ...item.positionStyles,
               zIndex: -1,
            },
            animationAttrs: {
               class: leave,
               onAnimationend,
            },
         })

         this.updatePositions()
      },
      playClearAll() {
         const { clearAll = '' } = config.animations.value

         if (!clearAll || this.isReducedMotion.value) return items.clear()

         elements.setRootAttrs({
            class: clearAll,
            onAnimationend: () => items.clear(),
         })
      },
      updatePositions(type = TType.PUSH) {
         const isReduced = this.isReducedMotion.value || type === TType.IMMEDIATE
         const leaveClass = config.animations.value.leave

         let accPrevHeights = 0

         for (const el of elements.getSortedItems()) {
            const id = el.dataset.notivueId!
            const item = items.get(id)

            if (!el || !item || item.animationAttrs.class === leaveClass) continue

            const { duration: transitionDuration, easing: transitionTimingFunction } =
               this.getTransitionData()

            items.update(id, {
               positionStyles: {
                  willChange: 'transform',
                  transform: `translate3d(0, ${accPrevHeights}px, 0)`,
                  ...(isReduced
                     ? { transition: 'none' }
                     : { transitionDuration, transitionTimingFunction }),
               },
            })

            accPrevHeights += (config.isTopAlign.value ? 1 : -1) * el.clientHeight
         }

         items.triggerRef()
      },
   }
}

export function createTimeouts(items: ItemsSlice, animations: AnimationsSlice) {
   return {
      isStreamPaused: ref(false),
      isStreamFocused: ref(false),
      debounceTimeout: undefined as undefined | number,
      setStreamPause(newVal = true) {
         this.isStreamPaused.value = newVal
      },
      setStreamFocus(newVal = true) {
         this.isStreamFocused.value = newVal
      },
      clearDebounceTimeout() {
         window.clearTimeout(this.debounceTimeout)
      },
      reset() {
         this.clearDebounceTimeout()
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
         if (items.length === 0 || this.isStreamPaused.value) return

         const pausedAt = Date.now()

         console.log('Pausing timeouts')
         items.updateAll((item) => {
            window.clearTimeout(item.timeout as number)

            return {
               ...item,
               elapsed: pausedAt - (item.resumedAt ?? item.createdAt) + (item.elapsed ?? 0),
            }
         })

         this.setStreamPause()
      },
      resume() {
         if (items.length === 0 || !this.isStreamPaused.value) return

         console.log('Resuming timeouts')
         items.updateAll((item) => {
            window.clearTimeout(item.timeout as number)
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
      resumeWithDebounce(ms: number) {
         this.debounceTimeout = window.setTimeout(() => {
            this.resume()
         }, ms)
      },
   }
}

/**
 * Methods called by users to create, update or remove notifications using the push object.
 */

export function createProxies({
   config,
   items,
   queue,
   animations,
   timeouts,
}: {
   config: ConfigSlice
   items: ItemsSlice
   queue: QueueSlice
   animations: AnimationsSlice
   timeouts: TimeoutsSlice
}) {
   return {
      destroyAll() {
         items.clear()
      },
      clearAll() {
         animations.playClearAll()
      },
      clear(id: string, { isDestroy = false } = {}) {
         const isLast = items.entries.value[items.entries.value.length - 1]?.id === id
         if (isLast) timeouts.resume()

         animations.playLeave(id, { isManual: true, isDestroy })
      },
      push<T extends Obj = Obj>(options: PushOptionsWithInternals<T>) {
         const createdAt = Date.now()
         const isQueueActive = config.enqueue.value
         const isUpdate = [NKeys.PROMISE_RESOLVE, NKeys.PROMISE_REJECT].includes(options.type)

         const entry = mergeOptions<T>(config.notifications.value, options)
         const createTimeout = () => timeouts.create(entry.id, entry.duration)

         if (isUpdate) {
            if (queue.get(entry.id)) {
               queue.update(entry.id, { ...entry, createdAt, timeout: createTimeout })
               queue.triggerRef()
            } else {
               items.update(entry.id, { ...entry, createdAt, timeout: createTimeout() })
               items.triggerRef()
            }
         } else {
            const hasReachedLimit = items.length >= config.limit.value
            const shouldDiscard = !isQueueActive && hasReachedLimit

            if (shouldDiscard) {
               const exceedingItems = items.entries.value.slice(config.limit.value - 1)
               exceedingItems.forEach(({ id }) => timeouts.create(id, 50))
            }

            const shouldEnqueue = isQueueActive && !options.skipQueue && hasReachedLimit

            const newEntry = {
               ...entry,
               createdAt,
               animationAttrs: {
                  class: animations.isReducedMotion.value ? '' : config.animations.value.enter,
                  onAnimationend() {
                     items.update(entry.id, {
                        animationAttrs: {
                           class: '',
                           onAnimationend: undefined,
                        },
                     })
                  },
               },
               timeout: shouldEnqueue ? createTimeout : createTimeout(),
               clear: () => this.clear(entry.id),
               destroy: () => this.clear(entry.id, { isDestroy: true }),
            } as StoreItem<T>

            if (shouldEnqueue) {
               queue.add(newEntry)
            } else {
               items.add(newEntry)
            }
         }
      },
   }
}
