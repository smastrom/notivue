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

      const wrapperRef = ref<HTMLElement>()

      // Reactivity - Props

      const position = toRef(props, 'position')
      const rootPadding = toRef(props, 'rootPadding')
      const maxWidth = toRef(props, 'maxWidth')
      const gap = toRef(props, 'gap')
      const pauseOnHover = toRef(props, 'pauseOnHover')
      const disabled = toRef(props, 'disabled')

      // Reactivity - Props - Computed

      const isTop = computed(() => position.value.split('-')[0] === 'top')

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

      // Reactivity - Composables - Behavior and Style

      const { refs, sortedIds, setRefs } = useRefsMap()

      const { wrapperStyles, containerStyles, rowStyles, boxStyles } = useReceiverStyles({
         rootPadding,
         maxWidth,
         position,
      })

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
         () => isTop.value,
         () => updatePosition(sortedIds.value[0], { actionType: 'SWITCH' }),
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
               if (items.value.length >= 10 && items.value[0].type !== NType.PROMISE) {
                  animateLeave(items.value[0].id)
               }

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
         animateItem(id, isTop.value ? 'VNEnterTop' : 'VNEnterBottom', () => {
            updateItem(id, { animClass: '', onAnimationend: undefined })
         })

         updatePosition(id, { actionType: 'PUSH' })
      }

      function animateLeave(id: string) {
         animateItem(id, isTop.value ? 'VNLeaveTop' : 'VNLeaveBottom', () => {
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
       *
       * Why reinventing the wheel? https://github.com/vuejs/vue/issues/11654
       */

      function getPrevEl(endIndex: number) {
         let prevEl = undefined as HTMLElement | undefined

         for (const id of sortedIds.value.slice(0, endIndex).reverse()) {
            const item = getItem(id)
            if (!item) continue

            if (
               (item.animClass !== 'VNLeaveTop' && item.animClass !== 'VNLeaveBottom') ||
               !('animClass' in item)
            ) {
               prevEl = refs.get(id)
               break
            }
         }

         return prevEl
      }

      async function updatePosition(
         id: string,
         { actionType }: { actionType: 'RESIZE' | 'REMOVE' | 'PUSH' | 'SWITCH' }
      ) {
         const currIndex = sortedIds.value.indexOf(id)
         const isLastMutated = actionType !== 'PUSH' && currIndex === sortedIds.value.length - 1

         if (currIndex === -1 || isLastMutated) return

         const factor = isTop.value ? 1 : -1

         switch (actionType) {
            case 'PUSH':
            case 'SWITCH':
               let accHeights = 0

               for (const id of sortedIds.value) {
                  const thisEl = refs.get(id)
                  const thisItem = getItem(id)

                  if (
                     !thisEl ||
                     !thisItem ||
                     thisItem.animClass === 'VNLeaveTop' ||
                     thisItem.animClass === 'VNLeaveBottom'
                  ) {
                     break
                  }

                  updateItem(id, {
                     style: {
                        ...(actionType === 'SWITCH' ? { transition: 'none' } : {}),
                        transform: `translate3d(0, ${accHeights}px, 0)`,
                     },
                  })

                  accHeights += factor * (thisEl.clientHeight + gap.value)
               }
               break

            case 'REMOVE':
            case 'RESIZE':
               const nextIds = sortedIds.value.slice(currIndex + 1)
               if (nextIds.length === 0) return

               let prevEl = actionType === 'REMOVE' ? getPrevEl(currIndex) : refs.get(id)
               let prevPos = 0

               if (prevEl)
                  if (isTop.value) {
                     prevPos =
                        prevEl.getBoundingClientRect().bottom - rootPadding.value[0] + gap.value
                  } else {
                     prevPos = -(
                        document.documentElement.clientHeight -
                        prevEl.getBoundingClientRect().top -
                        rootPadding.value[2] +
                        gap.value
                     )
                  }

               for (const id of nextIds) {
                  const thisItem = getItem(id)
                  const thisEl = refs.get(id)

                  if (
                     !thisEl ||
                     !thisItem ||
                     thisItem.animClass === 'VNLeaveTop' ||
                     thisItem.animClass === 'VNLeaveBottom'
                  ) {
                     continue
                  }

                  updateItem(id, {
                     style: {
                        ...(actionType === 'RESIZE' ? { transitionDuration: '150ms' } : {}),
                        transform: `translate3d(0, ${prevPos}px, 0)`,
                     },
                  })

                  prevPos += factor * (thisEl.getBoundingClientRect().height + gap.value)
               }
               break
         }
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
                                 ...rowStyles.value,
                                 ...item.style,
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
