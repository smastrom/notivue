import { ref, shallowRef, triggerRef } from 'vue'

import { getConfig } from './config'
import { mergeNotificationOptions } from './options'
import { createPush } from './createPush'

import { NotificationType as NType, FIXED_INCREMENT, TransitionType as TType } from './constants'

import type {
   DeepPartial,
   StoreItem,
   NotivueConfig,
   UserPushOptionsWithInternals,
   Obj,
} from '../types'

export function createStore(userConfig: NotivueConfig) {
   const config = getConfig(userConfig)

   const items = {
      data: shallowRef<StoreItem[]>([]),
      set(item: StoreItem) {
         this.data.value.unshift(item)
         triggerRef(this.data)
      },
      get(_id: string) {
         return this.data.value.find(({ id }) => id === _id)
      },
      remove(_id: string) {
         this.data.value = this.data.value.filter(({ id }) => id !== _id)
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
      updateAnimation(id: string, animationClass = '', onEnd: () => void) {
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
         this.updateAnimation(id, config.animations.value.enter, () => {
            this.update(id, { animationClass: '' })
         })
         this.updatePositions()
      },
      playLeave(id: string) {
         this.updatePositions()
         this.updateAnimation(id, config.animations.value.leave, () => this.remove(id))
         this.updatePositions()
      },
      playLeaveTimeout(id: string, time: number) {
         return window.setTimeout(() => this.playLeave(id), time)
      },
      playClearAll() {
         if (elements.wrapper.value) {
            elements.wrapper.value.classList.add(config.animations.value.clearAll ?? '')
            elements.wrapper.value.onanimationend = () => items.removeAll()
         }
      },
      updatePositions(type = TType.PUSH) {
         const factor = config.isTopAlign.value ? 1 : -1

         let accPrevHeights = 0

         const sortedItems = elements.items.value.sort(
            (a, b) => +b.dataset.notivueId! - +a.dataset.notivueId!
         )

         for (const el of sortedItems) {
            const currId = el.dataset.notivueId!
            const item = items.get(currId)

            if (!el || !item || item.animationClass === config.animations.value.leave) {
               continue
            }

            items.update(currId, {
               transitionStyles: {
                  ...(type === TType.HEIGHT ? { transitionProperty: 'all' } : {}),
                  ...(type === TType.SILENT ? { transition: 'none' } : {}),
                  transform: `translate3d(0, ${accPrevHeights}px, 0)`,
               },
            })

            accPrevHeights += factor * el.clientHeight
         }
      },
      pauseTimeouts() {
         if (!this.data.value) return

         const pausedAt = performance.now()

         this.updateAll((item) => {
            clearTimeout(item.timeoutId)

            return {
               ...item,
               elapsed: pausedAt - item.updatedAt + item.elapsed,
            }
         })
      },
      resumeTimeouts() {
         if (!this.data.value) return

         this.updateAll((item) => {
            const newTimeout = item.duration + FIXED_INCREMENT - item.elapsed

            return {
               ...item,
               updatedAt: performance.now(),
               timeoutId:
                  item.duration === Infinity
                     ? undefined
                     : items.playLeaveTimeout(item.id, newTimeout),
            }
         })
      },
      push<T extends Obj = Obj>(incomingOptions: UserPushOptionsWithInternals<T>) {
         const createdAt = Date.now()
         const updatedAt = performance.now()

         const notification = mergeNotificationOptions<T>(
            config.notifications.value,
            incomingOptions
         )

         const shouldSkipTimeout =
            notification.duration === Infinity || pointer.isHovering || pointer.isTouching

         if (
            ([NType.PROMISE_REJECT, NType.PROMISE_RESOLVE] as string[]).includes(
               incomingOptions.type
            )
         ) {
            const { timeoutId } = this.get(notification.id) ?? {}
            clearTimeout(timeoutId)

            this.update(notification.id, {
               ...notification,
               createdAt,
               updatedAt,
               timeoutId: shouldSkipTimeout
                  ? undefined
                  : this.playLeaveTimeout(notification.id, notification.duration),
            })
         } else {
            this.set({
               ...(notification as typeof notification & { props: T }),
               createdAt,
               updatedAt,
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
   }

   const pointer = {
      isTouching: false,
      isHovering: false,
      toggleTouch() {
         this.isTouching = !this.isTouching
      },
      toggleHover() {
         this.isHovering = !this.isHovering
      },
      reset() {
         this.isTouching = false
         this.isHovering = false
      },
   }

   const push = createPush(items)

   return {
      config,
      elements,
      items,
      pointer,
      push,
   }
}
