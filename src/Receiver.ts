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
} from 'vue'
import { useStore } from './useStore'
import { useReceiverStyles } from './useReceiverStyles'
import { useRefsMap } from './useRefsMap'
import { useResizeObserver } from './useResizeObserver'
import { defaultRenderFn } from './defaultRender'
import { defaultOptions } from './defaultOptions'
import { ariaRenderFn } from './ariaRender'
import { mergeOptions } from './utils'
import { NType, FIXED_INCREMENT } from './constants'
import { light } from './themes'
import type {
   ReceiverProps as Props,
   StoreItem,
   MergedOptions,
   MaybeRenderStatic,
   MaybeRenderPromiseResult,
   CtxProps,
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

      const yCssProp = computed(() => position.value.split('-')[0] as 'top' | 'bottom')

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

      // Reactivity - Composables - Data

      const { wrapperStyles, containerStyles, rowStyles, boxStyles } = useReceiverStyles({
         rootPadding,
         maxWidth,
         position,
      })

      const { refs, sortedIds, setRefs } = useRefsMap()

      // Reactivity - Composables - Behavior

      const resizeObserver = useResizeObserver({
         onSizeChange: (id) => updatePosition(id, { actionType: 'RESIZE' }),
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

      watch(
         () => yCssProp.value,
         (newPos, prevPos) => {
            updateAll((item) => {
               const currPos = parseFloat(item.style?.[prevPos] as string)
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
               const createdAt = performance.now()
               const options = mergeOptions(defaultOptions, props.options, pushOptions)

               let customComponent: Partial<
                  Pick<StoreItem, 'prevProps' | 'prevComponent' | 'customRenderFn'>
               > = {
                  customRenderFn: undefined,
               }

               if (
                  options.type.includes(NType.PROMISE_REJECT) ||
                  options.type.includes(NType.PROMISE_RESOLVE)
               ) {
                  const currItem = getItem(options.id)
                  const prevComponent = currItem?.prevComponent

                  if (prevComponent) {
                     const prevProps: Record<string, unknown> = { ...(currItem.prevProps ?? {}) }

                     delete prevProps.title
                     delete prevProps.message
                     delete prevProps.type
                     delete prevProps.duration
                     delete prevProps.close

                     const nextProps = { ...getCtxProps(options), prevProps }

                     customComponent = {
                        customRenderFn: () =>
                           h(
                              options.render?.component ?? prevComponent,
                              (
                                 options.render?.props as NonNullable<
                                    MaybeRenderPromiseResult['render']
                                 >['props']
                              )?.(nextProps) ?? {}
                           ),
                     }
                  }

                  updateItem(options.id, {
                     ...options,
                     ...customComponent,
                     timeoutId: isHovering
                        ? undefined
                        : createTimeout(options.id, options.duration),
                     createdAt,
                  })
               } else {
                  const component = options.render?.component

                  if (component) {
                     const props = ((
                        options.render?.props as NonNullable<
                           MaybeRenderStatic<CtxProps & Record<string, unknown>>['render']
                        >['props']
                     )?.(getCtxProps(options)) ?? {}) as CtxProps

                     customComponent = {
                        customRenderFn: () => h(component, props),
                        ...(options.type === NType.PROMISE
                           ? { prevProps: props, prevComponent: component }
                           : {}),
                     }
                  }

                  createItem({
                     ...options,
                     ...customComponent,
                     timeoutId:
                        options.type !== NType.PROMISE
                           ? createTimeout(options.id, options.duration)
                           : undefined,
                     clear: () => animateLeave(options.id),
                     createdAt,
                  })

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

         updatePosition(id, { actionType: 'PUSH' })
      }

      function animateLeave(id: string) {
         animateItem(id, 'VNLeave', () => {
            removeItem(id)
         })

         updatePosition(id, { actionType: 'REMOVE' })
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

      function updatePosition(id: string, { actionType }: { actionType: ActionType }) {
         const isResize = actionType === 'RESIZE'
         const isPush = actionType === 'PUSH'
         const isRemove = actionType === 'REMOVE'

         const ids = sortedIds.value
         const currIndex = ids.indexOf(id)

         const isLastRemoved = isRemove && ids.length > 1 && currIndex === ids.length - 1

         if (currIndex === -1 || isLastRemoved) return

         /**
          * 1. Get the first, previous item which is not animating.
          * Since ids are ordered by creation time, iterate backwards to get the most recent one
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

         // 2. Get the starting point from which to start accumulating heights of prev items that are not leaving

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
            // On first iteration, nextY is equal to the starting point
            updateItem(id, {
               style: {
                  transitionDuration: isResize ? '150ms' : '300ms',
                  [yCssProp.value]: startY + accPrevHeights + 'px',
               },
            })

            // Be 100% sure again that element is in the DOM
            const currEl = refs.get(id)

            // If the item is leaving, do not accumulate its height nor its gap
            if (!currEl || getItem(id)?.animClass === 'VNLeave') {
               accPrevHeights += 0
            } else {
               accPrevHeights += currEl.getBoundingClientRect().height + gap.value
            }
         })
      }

      // Functions - Utils

      function createTimeout(id: string, time: number) {
         return setTimeout(() => animateLeave(id), time)
      }

      function getCtxProps({ title, message, type, duration, id }: MergedOptions) {
         return { notifyProps: { title, message, type, duration, close: () => animateLeave(id) } }
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
                  const newTimeout = prevItem.duration + FIXED_INCREMENT - (prevItem.elapsed ?? 0)

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
                  {
                     style: wrapperStyles,
                     ref: wrapperRef,
                  },
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
                                 ...item.style,
                                 ...rowStyles.value,
                              },
                           },
                           h(
                              'div',
                              {
                                 class: item.animClass,
                                 style: boxStyles.value,
                                 onAnimationstart: item.onAnimationstart,
                                 onAnimationend: item.onAnimationend,
                              },
                              [item.customRenderFn?.() ?? defaultRenderFn(item), ariaRenderFn(item)]
                           )
                        )
                     )
                  )
               ),
         ])
   },
})
