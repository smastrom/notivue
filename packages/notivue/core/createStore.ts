import { ref, shallowRef, computed, triggerRef, nextTick, unref, isRef } from 'vue'

import {
   createRefs,
   mergeDeep,
   mergeNotificationOptions as mergeOptions,
   toRawConfig,
} from './utils'
import { getSlotItem } from '@/Notivue/utils'

import { isStatic, getSlotItem } from './utils'
import { DEFAULT_CONFIG, NotificationTypeKeys as NType } from './constants'

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

export let updateConfig: (newConfig: UpdateParam) => void = () => {}

export function createConfig(userConfig: NotivueConfig) {
   const config = createRefs(DEFAULT_CONFIG, userConfig)
   const isTopAlign = computed(() => config.position.value.startsWith('top'))

   function update(newConfig: UpdateParam) {
      if (typeof newConfig === 'function') newConfig = newConfig(toRawConfig(config))

      for (const key of Object.keys(newConfig) as (keyof NotivueConfig)[]) {
         if (typeof config[key].value === 'object') {
            config[key].value = mergeDeep(config[key].value as Obj, newConfig[key] as any)
         } else {
            config[key].value = newConfig[key] as any
         }
      }
   }

   updateConfig = update

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
         return this.entries.value.find((e) => e.id === id)
      },
      update(id: string, newOptions: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, newOptions)
      },
      triggerRef() {
         triggerRef(this.entries)
      },
      remove(id: string) {
         this.entries.value = this.entries.value.filter((e) => e.id !== id)
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
      findDupe(item: StoreItem) {
         return this.entries.value.find(
            (e) =>
               unref(e.message).replace(/\uFEFF/g, '') === unref(item.message).replace(/\uFEFF/g, '') && // prettier-ignore
               unref(e.title) === unref(item.title) &&
               e.type === item.type
         )
      },
      get(id: string) {
         return this.entries.value.find((e) => e.id === id)
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
         this.entries.value = this.entries.value.filter((e) => e.id !== id)

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

export function createElements() {
   type AnimationAttrs = { class: string; onAnimationend: () => void }

   return {
      root: ref<HTMLElement | null>(null),
      rootAttrs: shallowRef<Partial<AnimationAttrs>>({}),
      setRootAttrs(newAttrs: Partial<AnimationAttrs>) {
         this.rootAttrs.value = newAttrs
      },
      items: ref<HTMLElement[]>([]),
      getSortedItems() {
         // This is a bit dirty, but it's better than cloning and reversing the array on every repositioning
         return this.items.value.sort((a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!)
      },
      containers: ref<HTMLElement[]>([]),
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
            const style = window.getComputedStyle(animEl)

            this.transitionData = {
               duration: style.animationDuration,
               easing: style.animationTimingFunction,
            }
         }
      },
      playLeave(id: string, { isDestroy = false, isUserTriggered = false } = {}) {
         const item = items.get(id)

         window.clearTimeout(item?.timeout as number)

         function onAnimationend(e?: AnimationEvent) {
            if (e && e.currentTarget !== e.target) return

            items.remove(id)
            item?.[isUserTriggered ? 'onManualClear' : 'onAutoClear']?.(getSlotItem(item))
         }

         const { leave = '' } = config.animations.value

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

         items.entries.value.forEach((e) => window.clearTimeout(e.timeout as number))

         if (!clearAll || this.isReducedMotion.value) return items.clear()

         elements.setRootAttrs({
            class: clearAll,
            onAnimationend: () => items.clear(),
         })
      },
      updatePositions({ isImmediate = false } = {}) {
         const isReduced = this.isReducedMotion.value || isImmediate
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
      create(id: string, duration: number): number | undefined {
         if (this.isStreamPaused.value) return

         if (Number.isFinite(duration) && duration > 0) {
            return window.setTimeout(() => animations.playLeave(id), duration)
         }
      },
      pause() {
         if (items.length === 0 || this.isStreamPaused.value) return

         console.log('Pausing timeouts')

         this.setStreamPause()

         items.updateAll((item) => {
            window.clearTimeout(item.timeout as number)

            if (item.duration === Infinity) return item

            let remaining = 0

            if (item.remaining == null) {
               /**
                * If a dynamic notification is updated while the stream is paused and then the
                * stream is resumed -> paused again, the below subtraction must use `resumedAt`,
                * instead of `createdAt` to properly sync with the item duration...
                */
               remaining = item.duration - (Date.now() - (item.resumedAt ?? item.createdAt))
            } else {
               remaining = item.remaining - (Date.now() - item.resumedAt)
            }

            return {
               ...item,
               remaining,
            }
         })
      },
      resume() {
         if (items.length === 0 || !this.isStreamPaused.value) return

         console.log('Resuming timeouts')

         this.setStreamPause(false)

         items.updateAll((item) => {
            window.clearTimeout(item.timeout as number)

            if (item.duration === Infinity) return item

            return {
               ...item,
               timeout: this.create(item.id, item.remaining ?? item.duration),
               resumedAt: Date.now(), // ...which corresponds to the duration itself when the stream is resumed for the first time
            }
         })
      },
      resumeWithDebounce(ms: number) {
         this.debounceTimeout = window.setTimeout(() => {
            this.resume()
         }, ms)
      },
   }
}

export function createPushProxies({
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

         animations.playLeave(id, { isUserTriggered: true, isDestroy })
      },
      push<T extends Obj = Obj>(options: PushOptionsWithInternals<T>) {
         const entry = mergeOptions<T>(config.notifications.value, options)
         const createdAt = Date.now()

         if (config.avoidDuplicates.value && isStatic(entry.type)) {
            const dupe = items.findDupe(entry as StoreItem)

            if (dupe) {
               window.clearTimeout(dupe.timeout as number)

               items.update(dupe.id, {
                  createdAt,
                  duration: entry.duration,
                  remaining: undefined,
                  timeout: timeouts.create(dupe.id, entry.duration),
                  duplicateCount: dupe.duplicateCount + 1,
               })

               // Trick aria-atomic to announce again the notification
               isRef(dupe.message) ? (dupe.message.value += '\uFEFF') : (dupe.message += '\uFEFF')

               items.triggerRef()
            }

            const queueDupe = items.findDupe.call(queue, entry as StoreItem)

            if (queueDupe) {
               queue.update(queueDupe.id, {
                  duration: entry.duration,
                  createdAt,
                  duplicateCount: queueDupe.duplicateCount + 1,
               })
            }

            if (queueDupe || dupe) return
         }

         const createTimeout = () => timeouts.create(entry.id, entry.duration)

         if (options.type === NType.PROMISE_RESOLVE || options.type === NType.PROMISE_REJECT) {
            if (queue.get(entry.id)) {
               queue.update(entry.id, { ...entry, createdAt, timeout: createTimeout })
               queue.triggerRef()
            } else {
               items.update(entry.id, { ...entry, createdAt, timeout: createTimeout() })
               items.triggerRef()
            }
         } else {
            const isQueueActive = config.enqueue.value
            const hasReachedLimit = items.length >= config.limit.value
            const shouldDiscard = !isQueueActive && hasReachedLimit
            const shouldEnqueue = isQueueActive && !options.skipQueue && hasReachedLimit

            if (shouldDiscard) {
               items.entries.value
                  .slice(config.limit.value - 1)
                  .forEach((e) => timeouts.create(e.id, 1))
            }

            const item = {
               ...entry,
               createdAt,
               duplicateCount: 0,
               animationAttrs: {
                  class: animations.isReducedMotion.value ? '' : config.animations.value.enter,
                  onAnimationend() {
                     items.update(entry.id, {
                        animationAttrs: { class: '', onAnimationend: undefined },
                     })
                  },
               },
               timeout: shouldEnqueue ? createTimeout : createTimeout(),
               clear: () => this.clear(entry.id),
               destroy: () => this.clear(entry.id, { isDestroy: true }),
            } as StoreItem<T>

            if (shouldEnqueue) {
               queue.add(item)
            } else {
               items.add(item)
            }
         }
      },
   }
}
