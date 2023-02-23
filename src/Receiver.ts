import {
   defineComponent,
   h,
   toRef,
   nextTick,
   Teleport,
   watch,
   computed,
   type PropType,
   type CSSProperties,
} from 'vue'
import { useReceiver } from './useReceiver'
import { useReceiverStyles } from './useReceiverStyles'
import { useRefsMap } from './useRefsMap'
import { useResizeObserver } from './useResizeObserver'
import { defaultComponent } from './defaultComponent'
import { defaultOptions } from './defaultOptions'
import { ariaLive } from './ariaLive'
import { mergeOptions } from './utils'
import { NType, FIXED_INCREMENT } from './constants'
import { light } from './themes'
import type {
   ReceiverProps as Props,
   MergedOptions,
   Notification,
   Receiver as ReceiverT,
} from './types'

export const Receiver = defineComponent({
   name: 'VueNotify',
   inheritAttrs: false,
   props: {
      id: {
         type: String as PropType<Props['id']>,
         default: '',
      },
      pauseOnHover: {
         type: Boolean as PropType<Props['pauseOnHover']>,
         default: true,
      },
      disabled: {
         type: Boolean as PropType<Props['disabled']>,
         default: false,
      },
      rootPadding: {
         type: Array as PropType<Props['rootPadding']>,
         default: () => [20, 20, 20, 20],
      },
      maxWidth: {
         type: Number as PropType<Props['maxWidth']>,
         default: 1280,
      },
      position: {
         type: String as PropType<Props['position']>,
         default: 'top-center',
      },
      gap: {
         type: Number as PropType<Props['gap']>,
         default: 10,
      },
      options: {
         type: Object as PropType<Props['options']>,
         default: () => defaultOptions,
      },
      theme: {
         type: Object as PropType<Props['theme']>,
         default: () => light,
      },
   },
   setup(props) {
      let isHovering = false

      // Reactivity - Props

      const position = toRef(props, 'position')
      const rootPadding = toRef(props, 'rootPadding')
      const maxWidth = toRef(props, 'maxWidth')
      const gap = toRef(props, 'gap')
      const disabled = toRef(props, 'disabled')

      // Reactivity - Props - Computed

      const padding = computed(() => {
         const [top, , bottom] = rootPadding.value
         return { top, bottom }
      })

      const yCssProp = computed(() => position.value.split('-')[0] as keyof CSSProperties)

      // Reactivity - Composables

      const { items, incoming } = useReceiver(props.id)
      const { wrapperStyles, containerStyles, itemStyles } = useReceiverStyles({
         rootPadding,
         maxWidth,
         position,
      })

      const { refs, sortedIds, setRefs } = useRefsMap()

      const resizeObserver = useResizeObserver({
         onSizeChange: (id) => setNextY(id, { actionType: 'RESIZE' }),
      })

      // Watchers - Notifications

      let unsubscribe: ReturnType<typeof subscribe>

      watch(
         disabled,
         (isDisabled) => {
            if (isDisabled && unsubscribe) {
               unsubscribe()
               items.length = 0
               incoming.value = null as unknown as ReceiverT['incoming']['value']
            } else {
               incoming.value = {} as ReceiverT['incoming']['value']
               unsubscribe = subscribe()
            }
         },
         { immediate: true }
      )

      // Watchers - Styles

      watch(
         () => yCssProp.value,
         (newPosition, prevPosition) => {
            items.forEach((item) => {
               const currPos = parseFloat(item.style[prevPosition] as string)

               if (newPosition === 'top') {
                  item.style.top = currPos - padding.value.bottom + padding.value.top + 'px'
               } else {
                  item.style.bottom = currPos - padding.value.top + padding.value.bottom + 'px'
               }

               delete item.style[prevPosition]
            })
         },
         { flush: 'post' }
      )

      // Watchers - Resize

      watch(
         () => items.filter(({ type }) => type === NType.PROMISE).map(({ id }) => id),
         (newPromises) =>
            newPromises.length > 0 &&
            newPromises.forEach((id) => resizeObserver.value?.observe(refs.get(id) as HTMLElement)),
         { flush: 'post' }
      )

      // Watchers - Hover

      watch(
         () => items.length === 0,
         (noNotifications) => noNotifications && (isHovering = false),
         { flush: 'post' }
      )

      // Functions - Listener

      function subscribe() {
         return watch(
            incoming,
            (pushOptions) => {
               let customRender: Partial<Pick<Notification, 'props' | 'component' | 'h'>> = {
                  h: undefined,
               }

               const options = mergeOptions(props.options, pushOptions)
               const createdAt = performance.now()

               if (
                  options.type.includes(NType.PROMISE_REJECT) ||
                  options.type.includes(NType.PROMISE_RESOLVE)
               ) {
                  const currIndex = items.findIndex((data) => data.id === options.id)
                  const prevComponent = items[currIndex]?.component

                  if (prevComponent) {
                     const { title, message, type, close, ...prevProps } = items[currIndex].props
                     const nextProps = { ...getCtxProps(options), prevProps }

                     customRender = {
                        h: () =>
                           h(
                              options.render?.component ?? prevComponent,
                              options.render?.props?.(nextProps) ?? {}
                           ),
                     }
                  }

                  items[currIndex] = {
                     ...items[currIndex],
                     ...options,
                     ...customRender,
                     timeoutId: isHovering
                        ? undefined
                        : createTimeout(options.id, options.duration),
                     createdAt,
                  }
               } else {
                  const component = options.render?.component

                  if (component) {
                     const props = options.render?.props?.(getCtxProps(options)) ?? {}
                     customRender = {
                        h: () => h(component, props),
                        ...(options.type === NType.PROMISE ? { props, component } : {}),
                     }
                  }

                  items.push({
                     ...options,
                     ...customRender,
                     timeoutId:
                        options.type !== NType.PROMISE &&
                        createTimeout(options.id, options.duration),
                     clear: () => animateLeave(options.id),
                     createdAt,
                  } as Notification)

                  nextTick(() => animateEnter(options.id))
               }
            },
            { flush: 'post' }
         )
      }

      // Functions - Animations

      function animateEnter(id: string) {
         const item = getItem(id)
         if (item) {
            item.animClass = 'VNEnter'
            item.onAnimationend = () => {
               item.animClass = ''
               item.onAnimationend = undefined
            }
         }

         setNextY(id, { actionType: 'PUSH' })
      }

      function animateLeave(id: string) {
         const item = getItem(id)
         if (item) {
            item.animClass = 'VNLeave'
            item.onAnimationend = () => removeItem(id)
         }

         setNextY(id, { actionType: 'REMOVE' })
      }

      // Functions - Repositioning (Transitions)

      type ActionType = 'RESIZE' | 'REMOVE' | 'PUSH'

      // Reason for reinventing the wheel: https://github.com/vuejs/vue/issues/11654

      function setNextY(id: string, { actionType }: { actionType: ActionType }) {
         const isResize = actionType === 'RESIZE'
         const isPush = actionType === 'PUSH'
         const isRemove = actionType === 'REMOVE'

         const ids = sortedIds.value
         const currIndex = ids.indexOf(id)

         const isLastRemoved = isRemove && ids.length > 1 && currIndex === ids.length - 1

         if (currIndex === -1 || isLastRemoved) return

         /**
          * 1. Get the first, previous item which is not animating.
          * Since items are ordered by creation time, iterate backwards to get the most recent one
          */

         let prevEl: HTMLElement | undefined = undefined as unknown as HTMLElement

         if (!isPush) {
            for (const prevId of ids.slice(0, currIndex).reverse()) {
               if (getItem(prevId)?.animClass !== 'VNLeave') {
                  prevEl = refs.get(prevId)
                  break
               }
            }
         }

         // 2. Get the starting point from which starting accumulating heights of the items that are not leaving

         let startY = yCssProp.value === 'top' ? padding.value.top : padding.value.bottom

         if (prevEl) {
            if (yCssProp.value === 'top') {
               startY = prevEl.getBoundingClientRect().bottom + gap.value
            } else {
               startY = window.innerHeight - prevEl.getBoundingClientRect().top + gap.value
            }
         }

         /**
          * 3. Iterate over the next items and set their new top/bottom.
          * Since they're ordered by creation date, if stream is aligned to bottom,
          * it will iterate "upwards" and vice versa.
          */

         let accPrevHeights = 0
         let startIndex = !isRemove ? currIndex : currIndex + 1

         ids.slice(startIndex).forEach((id) => {
            const currItem = getItem(id)

            // On first iteration, nextY is equal to the starting point
            if (currItem) {
               currItem.style = {
                  transitionDuration: isResize ? '150ms' : '300ms',
                  [yCssProp.value]: startY + accPrevHeights + 'px',
               }

               // Be 100% sure element is not in the DOM or leaving
               const currEl = refs.get(id)

               // If the item is leaving, do not accumulate its height nor its gap
               if (!currEl || currItem.animClass === 'VNLeave') {
                  accPrevHeights += 0
               } else {
                  accPrevHeights += currEl.clientHeight + gap.value
               }
            }
         })
      }

      // Functions - Utils

      function getItem(id: string) {
         return items.find(({ id: _id }) => _id === id)
      }

      function removeItem(id: string) {
         items.splice(
            items.findIndex(({ id: _id }) => _id === id),
            1
         )
      }

      function createTimeout(id: string, time: number) {
         return setTimeout(() => animateLeave(id), time)
      }

      function getCtxProps({ title, message, type, id }: MergedOptions) {
         return { notifyProps: { title, message, type, close: () => animateLeave(id) } }
      }

      // Props

      const pointerEvents = {
         onPointerenter() {
            if (items.length > 0 && !isHovering) {
               isHovering = true

               const stoppedAt = performance.now()

               items.forEach((prevData, currIndex) => {
                  clearTimeout(prevData.timeoutId)

                  items[currIndex] = {
                     ...prevData,
                     stoppedAt,
                     elapsed: stoppedAt - prevData.createdAt + (prevData.elapsed ?? 0),
                  }
               })
            }
         },
         onPointerleave() {
            if (items.length > 0 && isHovering) {
               items.forEach((prevData, currIndex) => {
                  const newTimeout = prevData.duration + FIXED_INCREMENT - prevData.elapsed

                  items[currIndex] = {
                     ...prevData,
                     createdAt: performance.now(),
                     timeoutId:
                        prevData.type !== NType.PROMISE
                           ? createTimeout(prevData.id, newTimeout)
                           : undefined,
                  }
               })

               isHovering = false
            }
         },
      }

      return () =>
         h(Teleport, { to: 'body' }, [
            items.length > 0 &&
               h(
                  'div',
                  { style: wrapperStyles },
                  h(
                     'div',
                     {
                        style: { ...containerStyles.value, ...props.theme },
                        ...(props.id ? { 'data-vuenotify-id': props.id } : {}),
                        ...(props.pauseOnHover ? pointerEvents : {}),
                     },
                     items.map((item) =>
                        h(
                           'div',
                           {
                              key: item.id,
                              'data-id': item.id,
                              ref: (_ref) => setRefs(_ref as HTMLElement | null, item.id),
                              style: {
                                 ...itemStyles.value,
                                 ...item.style,
                              },
                           },
                           [item.h?.() ?? defaultComponent(item), ariaLive(item)]
                        )
                     )
                  )
               ),
         ])
   },
})
