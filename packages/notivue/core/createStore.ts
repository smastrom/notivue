import { ref, shallowRef, triggerRef, nextTick, type InjectionKey } from 'vue'

import { getConfig } from './config'
import { mergeNotificationOptions } from './options'
import { createPush } from './createPush'
import { isReducedMotion } from './utils'

import {
   NotificationTypeKeys as NKeys,
   TransitionType as TType,
   FIXED_TIMEOUT_INCREMENT,
} from './constants'

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
      data: shallowRef<StoreItem[]>([]),
      arePaused: false,
      set(item: StoreItem) {
         this.data.value.unshift(item)
         triggerRef(this.data)
      },
      get(id: string) {
         return this.data.value.find(({ id: _id }) => id === _id)
      },
      remove(id: string) {
         this.data.value = this.data.value.filter(({ id: _id }) => id !== _id)
      },
      removeAll() {
         this.data.value = []
      },
      update(id: string, options: DeepPartial<StoreItem>) {
         Object.assign(this.get(id) ?? {}, options)
         triggerRef(this.data)
      },
      updateAll(updateItem: (item: StoreItem) => StoreItem) {
         this.data.value = this.data.value.map((item) => updateItem(item))
      },
      updateAnimation(id: string, animationClass: string, onEnd = () => {}) {
         this.update(id, {
            animationClass,
            onAnimationstart: (event: AnimationEvent) => event.stopPropagation(),
            onAnimationend: (event: AnimationEvent) => {
               event.stopPropagation()
               onEnd()
            },
         })
      },
      playEnter(id: string) {
         if (isReducedMotion()) return // Will be positioned by updatePositions...

         this.updateAnimation(
            id,
            config.animations.value.enter ?? '' // ...same if no class is specified
         )
         this.updatePositions()
      },
      playLeave(id: string) {
         if (!config.animations.value.leave || isReducedMotion()) return this.remove(id)

         this.updateAnimation(id, config.animations.value.leave, () => this.remove(id))
         this.updatePositions()
      },
      playLeaveTimeout(id: string, time: number) {
         return window.setTimeout(() => this.playLeave(id), time)
      },
      playClearAll() {
         if (elements.wrapper.value) {
            if (!config.animations.value.clearAll || isReducedMotion()) return this.removeAll()

            elements.wrapper.value.classList.add(config.animations.value.clearAll)
            elements.wrapper.value.onanimationend = () => this.removeAll()
         }
      },
      pauseTimeouts() {
         if (this.data.value.length === 0 || this.arePaused) return

         const pausedAt = performance.now()

         this.updateAll((item) => {
            clearTimeout(item.timeoutId)

            return {
               ...item,
               elapsed: pausedAt - item.resumedAt + item.elapsed,
            }
         })

         nextTick(() => (this.arePaused = true))
      },
      resumeTimeouts() {
         if (this.data.value.length === 0 || !this.arePaused) return

         this.updateAll((item) => {
            const newTimeout = item.duration + FIXED_TIMEOUT_INCREMENT - item.elapsed

            return {
               ...item,
               resumedAt: performance.now(),
               timeoutId:
                  item.duration === Infinity
                     ? undefined
                     : items.playLeaveTimeout(item.id, newTimeout),
            }
         })

         nextTick(() => (this.arePaused = false))
      },
      updatePositions(type = TType.PUSH) {
         const sortedItems = elements.items.value.sort(
            (a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!
         )

         const isReduced = isReducedMotion() || type === TType.SILENT

         let accPrevHeights = 0

         for (const el of sortedItems) {
            const currId = el.dataset.notivueId!
            const item = items.get(currId)

            if (!el || !item || item.animationClass === config.animations.value.leave) {
               continue
            }

            items.update(currId, {
               transitionStyles: {
                  transitionDuration: elements.getAnimationData().duration,
                  transitionTimingFunction: elements.getAnimationData().easing,
                  ...(type === TType.HEIGHT ? { transitionProperty: 'all' } : {}),
                  ...(isReduced ? { transition: 'none' } : {}),

                  transform: `translate3d(0, ${accPrevHeights}px, 0)`,
               },
            })

            accPrevHeights += (config.isTopAlign.value ? 1 : -1) * el.clientHeight
         }
      },
      push<T extends Obj = Obj>(incomingOptions: UserPushOptionsWithInternals<T>) {
         const createdAt = Date.now()
         const resumedAt = performance.now()

         const notification = mergeNotificationOptions<T>(
            config.notifications.value,
            incomingOptions
         )

         const shouldSkipTimeout = notification.duration === Infinity || this.arePaused

         if (
            ([NKeys.PROMISE_REJECT, NKeys.PROMISE_RESOLVE] as string[]).includes(
               incomingOptions.type
            )
         ) {
            const { timeoutId } = this.get(notification.id) ?? {}
            clearTimeout(timeoutId)

            this.update(notification.id, {
               ...notification,
               createdAt,
               resumedAt,
               timeoutId: shouldSkipTimeout
                  ? undefined
                  : this.playLeaveTimeout(notification.id, notification.duration),
            })
         } else {
            if (this.data.value.length >= config.limit.value) {
               const additionalItems = [...this.data.value].slice(config.limit.value - 1)

               additionalItems.forEach(({ id }) => this.playLeave(id))
            }

            this.set({
               ...(notification as typeof notification & { props: T }),
               createdAt,
               resumedAt,
               elapsed: 0,
               timeoutId: shouldSkipTimeout
                  ? undefined
                  : this.playLeaveTimeout(notification.id, notification.duration),
               clear: () => this.playLeave(notification.id),
               destroy: () => this.remove(notification.id),
            })

            this.playEnter(notification.id)
         }
      },
   }

   const elements = {
      wrapper: ref<HTMLElement | null>(null),
      items: ref<HTMLElement[]>([]),
      /**
       * Gets CSS animation duration and easing on first push and stores them.
       * Returns the stored values which are applied to internal reposition transitions.
       */
      animationData: null as null | { duration: string; easing: string },
      getAnimationData() {
         if (!this.animationData) {
            const animEl = this.wrapper.value?.querySelector(`.${config.animations.value.enter}`)

            if (!animEl) {
               this.animationData = { duration: '0s', easing: 'ease' }
            } else {
               const style = getComputedStyle(animEl)

               this.animationData = {
                  duration: style.animationDuration,
                  easing: style.animationTimingFunction,
               }
            }
         }
         return this.animationData
      },
   }

   const push = createPush(items)

   return {
      config,
      elements,
      items,
      push,
   }
}
