import {
   Teleport,
   defineComponent,
   ref,
   computed,
   watch,
   watchEffect,
   watchPostEffect,
   h,
   toRef,
   nextTick,
   type PropType,
} from 'vue'
import { useStore } from './useStore'
import { useReceiverStyles } from './useReceiverStyles'
import { useRefsMap } from './useRefsMap'
import { useResizeObserver } from './useResizeObserver'
import { defaultRenderFn } from './defaultRender'
import { defaultAnimations, defaultOptions } from './defaultOptions'
import { ariaRenderFn } from './ariaRender'
import { mergeOptions } from './utils'
import {
   FIXED_INCREMENT,
   NOTIFICATIONS_LIMIT,
   COMPONENT_NAME,
   NotificationTypes as NType,
   TransitionTypes as TType,
} from './constants'
import { light } from './themes'
import type {
   ReceiverProps as Props,
   StoreItem,
   MergedOptions,
   MaybeRenderStatic,
   MaybeRenderPromiseResult,
   CtxProps,
} from './types'
import { useWindowSize } from './useWindowSize'

export const Receiver = defineComponent({
   name: COMPONENT_NAME,
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
         default: 0,
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
      animations: {
         type: Object as PropType<Props['animations']>,
         default: () => defaultAnimations,
      },
      icons: {
         type: Object as PropType<Props['icons']>,
         default: () => ({}),
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
      const isDisabled = toRef(props, 'disabled')
      const animations = toRef(props, 'animations')

      // Reactivity - Props - Computed

      const isTop = computed(() => position.value.startsWith('top'))

      const mergedAnims = computed(() => ({
         ...defaultAnimations,
         ...animations.value,
      }))

      // Reactivity - Store

      const {
         items,
         incoming,
         clearTrigger,
         createItem,
         getItem,
         updateItem,
         removeItem,
         destroyAll,
         updateAll,
         animateItem,
         resetClearTrigger,
      } = useStore(props.id)

      // Reactivity - Store - Computed

      const hasItems = computed(() => items.value.length > 0)

      // Reactivity - Composables - Behavior and Style

      const { refs, sortedIds, setRefs } = useRefsMap()

      const { wrapperStyles, containerStyles, rowStyles, boxStyles } = useReceiverStyles({
         rootPadding,
         maxWidth,
         position,
         gap,
      })

      const resizeObserver = useResizeObserver(() => setPositions(TType.HEIGHT))

      // Watchers - Notifications

      let detachListener: ReturnType<typeof attachListener>

      watchEffect(() => {
         if (isDisabled.value && detachListener) {
            detachListener()
            destroyAll()
         } else {
            detachListener = attachListener()
         }
      })

      watchPostEffect(() => {
         if (clearTrigger.value && hasItems.value) {
            animateClearAll()
         }
      })

      // Watchers - Resize and Position

      useWindowSize(() => setPositions(TType.SILENT))

      watch(isTop, () => setPositions(TType.SILENT))

      watch(
         () => items.value.filter(({ type }) => type === NType.PROMISE).map(({ id }) => id),
         (newPromises) => {
            if (newPromises.length > 0) {
               newPromises.forEach((id) =>
                  resizeObserver.value?.observe(refs.get(id) as HTMLElement)
               )
            }
         },
         { flush: 'post' }
      )

      // Watchers - Hover

      watchPostEffect(() => {
         if (!hasItems.value) {
            isHovering = false
         }
      })

      // Functions - Listener

      function attachListener() {
         return watch(
            incoming,
            (pushOptions) => {
               if (
                  items.value.length >= NOTIFICATIONS_LIMIT &&
                  items.value[0].type !== NType.PROMISE
               ) {
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
                     const prevProps = { ...(currItem.prevProps ?? {}) }

                     delete prevProps.title
                     delete prevProps.message
                     delete prevProps.type
                     delete prevProps.duration
                     delete prevProps.close

                     const newComponent = options.render?.component
                     const newProps = { ...getCtxProps(options), prevProps }

                     customComponent = {
                        customRenderFn: () =>
                           h(
                              newComponent ? newComponent() : prevComponent(),
                              (
                                 options.render?.props as NonNullable<
                                    MaybeRenderPromiseResult['render']
                                 >['props']
                              )?.(newProps) ?? {}
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
                  const _customComponent = options.render?.component

                  if (_customComponent) {
                     const props = ((
                        options.render?.props as NonNullable<
                           MaybeRenderStatic<CtxProps & Record<string, unknown>>['render']
                        >['props']
                     )?.(getCtxProps(options)) ?? {}) as CtxProps

                     customComponent = {
                        customRenderFn: () => h(_customComponent(), props),
                        ...(options.type === NType.PROMISE
                           ? { prevProps: props, prevComponent: _customComponent }
                           : {}),
                     }
                  }

                  createItem({
                     ...options,
                     ...customComponent,
                     timeoutId:
                        options.duration === Infinity
                           ? undefined
                           : createTimeout(options.id, options.duration),
                     clear: () => animateLeave(options.id),
                     createdAt,
                  })

                  nextTick(() => animateEnter(options.id))
               }
            },
            { flush: 'post' }
         )
      }

      function createTimeout(id: string, time: number) {
         return setTimeout(() => animateLeave(id), time)
      }

      function getCtxProps({ title, message, type, duration, id }: MergedOptions) {
         return { notsyProps: { title, message, type, duration, close: () => animateLeave(id) } }
      }

      // Functions - Animations

      function animateEnter(id: string) {
         animateItem(id, mergedAnims.value.enter, () =>
            updateItem(id, { animClass: '', onAnimationend: undefined })
         )

         setPositions()
      }

      function animateLeave(id: string) {
         animateItem(id, mergedAnims.value.leave, () => removeItem(id))

         setPositions()
      }

      function animateClearAll() {
         if (wrapperRef.value) {
            wrapperRef.value.classList.add(mergedAnims.value.clearAll)
            wrapperRef.value.onanimationend = () => {
               destroyAll()
               resetClearTrigger()
            }
         }
      }

      // Functions - Transitions

      function setPositions(type: TType = TType.PUSH) {
         const factor = isTop.value ? 1 : -1

         let accPrevHeights = 0

         for (const id of sortedIds.value) {
            const thisEl = refs.get(id)
            const thisItem = getItem(id)

            if (!thisEl || !thisItem || thisItem.animClass === mergedAnims.value.leave) {
               continue
            }

            updateItem(id, {
               style: {
                  ...(type === TType.HEIGHT ? { transitionProperty: 'all' } : {}),
                  ...(type === TType.SILENT ? { transition: 'none' } : {}),
                  transform: `translate3d(0, ${accPrevHeights}px, 0)`,
               },
            })

            accPrevHeights += factor * thisEl.clientHeight
         }
      }

      // Props

      const pointerEvents = {
         onPointerenter() {
            if (hasItems.value && !isHovering) {
               isHovering = true

               const stoppedAt = performance.now()

               updateAll((item) => {
                  clearTimeout(item.timeoutId)

                  return {
                     ...item,
                     stoppedAt,
                     elapsed: stoppedAt - item.createdAt + (item.elapsed ?? 0),
                  }
               })
            }
         },
         onPointerleave() {
            if (hasItems.value && isHovering) {
               updateAll((item) => {
                  const newTimeout = item.duration + FIXED_INCREMENT - (item.elapsed ?? 0)

                  return {
                     ...item,
                     createdAt: performance.now(),
                     timeoutId:
                        item.duration === Infinity ? undefined : createTimeout(item.id, newTimeout),
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
                        ...(pauseOnHover.value ? pointerEvents : {}),
                     },
                     items.value.map((item) =>
                        h(
                           'div',
                           {
                              key: item.id,
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
                              [
                                 item.customRenderFn?.() ??
                                    defaultRenderFn({
                                       item,
                                       iconSrc: props.icons[item.type],
                                       closeIconSrc: props.icons.close,
                                    }),
                                 ariaRenderFn(item),
                              ]
                           )
                        )
                     )
                  )
               ),
         ])
   },
})
