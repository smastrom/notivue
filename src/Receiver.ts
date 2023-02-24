import {
   defineComponent,
   ref,
   computed,
   watch,
   h,
   toRef,
   nextTick,
   Teleport,
   type PropType,
   type CSSProperties,
} from 'vue'
import { useStore } from './useStore'
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
         default: () => [20, 20, 140, 20],
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

      // Reactivity - Internal

      const wrapperRef = ref<HTMLElement>()

      // Reactivity - Props

      const position = toRef(props, 'position')
      const rootPadding = toRef(props, 'rootPadding')
      const maxWidth = toRef(props, 'maxWidth')
      const gap = toRef(props, 'gap')
      const pauseOnHover = toRef(props, 'pauseOnHover')
      const disabled = toRef(props, 'disabled')

      // Reactivity - Props - Computed

      const padding = computed(() => {
         const [top, , bottom] = rootPadding.value
         return { top, bottom }
      })

      const yCssProp = computed(() => position.value.split('-')[0] as keyof CSSProperties)

      // Reactivity - Store

      const {
         items,
         incoming,
         clear,
         createItem,
         getItem,
         updateItem,
         removeItem,
         destroyAll,
         updateAll,
         animateItem,
         resetClearAll,
      } = useStore(props.id)

      // Reactivity - Store - Computed

      const newPromises = computed(() =>
         items.value.filter(({ type }) => type === NType.PROMISE).map(({ id }) => id)
      )

      const haveNotifications = computed(() => items.value.length > 0)

      // Reactivity - Composables

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
               destroyAll()
            } else {
               unsubscribe = subscribe()
            }
         },
         { immediate: true }
      )

      watch(
         clear,
         (shouldClear) => {
            if (shouldClear && haveNotifications.value) {
               animateClearAll()
            }
         },
         { flush: 'post' }
      )

      // Watchers - Styles

      watch(
         () => yCssProp.value,
         (newPos, prevPos) => {
            updateAll((item) => {
               const currPos = parseFloat(item.style[prevPos] as string)
               // @ts-ignore
               const _newPos = currPos - padding.value[prevPos] + padding.value[newPos]

               return {
                  ...item,
                  style: { [newPos]: _newPos + 'px' },
               }
            })
         },
         { flush: 'post' }
      )

      // Watchers - Resize

      watch(
         newPromises,
         (_newPromises) =>
            _newPromises.length > 0 &&
            _newPromises.forEach((id) =>
               resizeObserver.value?.observe(refs.get(id) as HTMLElement)
            ),
         { flush: 'post' }
      )

      // Watchers - Hover

      watch(haveNotifications, (noNotifications) => !noNotifications && (isHovering = false), {
         flush: 'post',
      })

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
                  const currItem = getItem(options.id)
                  const prevComponent = currItem?.component

                  if (prevComponent) {
                     const { title, message, type, close, ...prevProps } = currItem.props
                     const nextProps = { ...getCtxProps(options), prevProps }

                     customRender = {
                        h: () =>
                           h(
                              options.render?.component ?? prevComponent,
                              options.render?.props?.(nextProps) ?? {}
                           ),
                     }
                  }

                  updateItem(options.id, {
                     ...options,
                     ...customRender,
                     timeoutId: isHovering
                        ? undefined
                        : createTimeout(options.id, options.duration),
                     createdAt,
                  })
               } else {
                  const component = options.render?.component

                  if (component) {
                     const props = options.render?.props?.(getCtxProps(options)) ?? {}
                     customRender = {
                        h: () => h(component, props),
                        ...(options.type === NType.PROMISE ? { props, component } : {}),
                     }
                  }

                  createItem({
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
         animateItem(id, 'VNEnter', () => {
            updateItem(id, { animClass: '', onAnimationend: undefined })
         })

         setNextY(id, { actionType: 'PUSH' })
      }

      function animateLeave(id: string) {
         animateItem(id, 'VNLeave', () => {
            removeItem(id)
         })

         setNextY(id, { actionType: 'REMOVE' })
      }

      function animateClearAll() {
         if (wrapperRef.value) {
            wrapperRef.value.classList.add('VNClear')
            wrapperRef.value.onanimationend = () => {
               destroyAll()
               resetClearAll()
            }
         }
      }

      /**
       * Functions - Repositioning (Transitions)
       * Reason for reinventing the wheel: https://github.com/vuejs/vue/issues/11654
       */

      type ActionType = 'RESIZE' | 'REMOVE' | 'PUSH'

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
            for (const id of ids.slice(0, currIndex).reverse()) {
               if (getItem(id)?.animClass !== 'VNLeave') {
                  prevEl = refs.get(id)
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
          * 3. Iterate over next items and set their new top/bottom.
          * Since they're ordered by creation date, if stream is aligned to bottom,
          * it will iterate "upwards" and vice versa.
          */

         let accPrevHeights = 0
         let startIndex = !isRemove ? currIndex : currIndex + 1

         ids.slice(startIndex).forEach((id) => {
            const currItem = getItem(id)

            // On first iteration, nextY is equal to the starting point
            if (currItem) {
               // IMPROVE THIS
               updateItem(id, {
                  style: {
                     transitionDuration: isResize ? '150ms' : '300ms',
                     [yCssProp.value]: startY + accPrevHeights + 'px',
                  },
               })

               // Be 100% sure element is in the DOM
               const currEl = refs.get(id)

               // If the item is leaving, do not accumulate its height nor its gap
               if (!currEl || currItem.animClass === 'VNLeave') {
                  accPrevHeights += 0
               } else {
                  accPrevHeights += currEl.getBoundingClientRect().height + gap.value
               }
            }
         })
      }

      // Functions - Utils

      function createTimeout(id: string, time: number) {
         return setTimeout(() => animateLeave(id), time)
      }

      function getCtxProps({ title, message, type, id }: MergedOptions) {
         return { notifyProps: { title, message, type, close: () => animateLeave(id) } }
      }

      // Props

      const pointerEvents = {
         onPointerenter() {
            if (haveNotifications.value && !isHovering) {
               isHovering = true

               const stoppedAt = performance.now()

               updateAll((prevItem) => {
                  clearTimeout(prevItem.timeoutId)

                  return {
                     ...prevItem,
                     stoppedAt,
                     elapsed: stoppedAt - prevItem.createdAt + (prevItem.elapsed ?? 0),
                  }
               })
            }
         },
         onPointerleave() {
            if (haveNotifications.value && isHovering) {
               updateAll((prevItem) => {
                  const newTimeout = prevItem.duration + FIXED_INCREMENT - prevItem.elapsed

                  return {
                     ...prevItem,
                     createdAt: performance.now(),
                     timeoutId:
                        prevItem.type !== NType.PROMISE
                           ? createTimeout(prevItem.id, newTimeout)
                           : undefined,
                  }
               })

               isHovering = false
            }
         },
      }

      return () =>
         h(Teleport, { to: 'body' }, [
            items.value.length > 0 &&
               h(
                  'div',
                  { style: wrapperStyles, ref: wrapperRef },
                  h(
                     'div',
                     {
                        style: { ...containerStyles.value, ...props.theme },
                        ...(props.id ? { 'data-vuenotify-id': props.id } : {}),
                        ...(pauseOnHover.value ? pointerEvents : {}),
                     },
                     items.value.map((item) =>
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
                           h(
                              'div',
                              {
                                 class: item.animClass,
                                 onAnimationstart: item.onAnimationstart,
                                 onAnimationend: item.onAnimationend,
                              },
                              [item.h?.() ?? defaultComponent(item), ariaLive(item)]
                           )
                        )
                     )
                  )
               ),
         ])
   },
})
