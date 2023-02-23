import { defineComponent, h, toRef, nextTick, Teleport, watch, computed, type PropType } from 'vue'
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

const PADDING_TOP = 20
const GAP = 10

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
      rootMargin: {
         type: String as PropType<Props['rootMargin']>,
         default: '20px',
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
         default: 20,
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
      const rootMargin = toRef(props, 'rootMargin')
      const maxWidth = toRef(props, 'maxWidth')
      const disabled = toRef(props, 'disabled')

      const cssProp = computed(() => {
         const [y, x] = position.value.split('-')
         return { y, x }
      })

      // Reactivity - Composables

      const { items, incoming } = useReceiver(props.id)
      const { wrapperStyles, containerStyles } = useReceiverStyles({
         rootMargin,
         maxWidth,
         position,
      })

      const { refs, refsData, setRefs } = useRefsMap()

      const resizeObserver = useResizeObserver({ onSizeChange: setNewTop })

      // Watchers

      let unsubscribe: ReturnType<typeof subscribe>

      watch(
         () => cssProp.value.y,
         (newY, prevY) => {
            items.forEach((item) => {
               // @ts-ignore
               item.style[newY] = item.style[prevY]
               // @ts-ignore
               delete item.style[prevY]
            })
         },
         { flush: 'post' }
      )

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

      watch(
         () => items.filter(({ type }) => type === NType.PROMISE).map(({ id }) => id),
         (newPromises) =>
            newPromises.length > 0 &&
            newPromises.forEach((id) => resizeObserver.value?.observe(refs.get(id) as HTMLElement)),
         { flush: 'post' }
      )

      watch(
         () => items.filter(({ animClass }) => animClass === 'VNLeave').length === 0,
         (areDestroyed) => areDestroyed && setNewTop(),
         { flush: 'post' }
      )

      watch(
         () => items.length === 0,
         (noNotifications) => noNotifications && (isHovering = false),
         { flush: 'post' }
      )

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
                     clear: () => setLeave(options.id),
                     createdAt,
                  } as Notification)

                  nextTick(() => setEnter(options.id))
               }
            },
            { flush: 'post' }
         )
      }

      // Functions - Animations / Transitions

      function setNewTop(currId = '') {
         const { ids, heights } = refsData.value
         const start = ids.indexOf(currId) + 1

         ids.slice(start).forEach((id, index) => {
            const prevHeights = heights
               .slice(0, start + index)
               .reduce((acc, curr) => acc + curr, PADDING_TOP)

            const currItem = getItem(id)

            if (currItem) {
               currItem.style = {
                  [cssProp.value.y]: prevHeights + GAP * (start + index) + 'px',
               }
            }
         })
      }

      function setEnter(id: string) {
         const item = getItem(id)
         if (item) {
            item.animClass = 'VNEnter'
            item.onAnimationend = () => {
               item.animClass = ''
               item.onAnimationend = undefined
            }
         }
         setNewTop()
      }

      function setLeave(id: string) {
         const item = getItem(id)
         if (item) {
            item.animClass = 'VNLeave'
            item.onAnimationend = () => removeItem(id)
         }

         // TO DO: Improve
         const { ids, tops, bottoms, heights } = refsData.value
         const removedIndex = ids.indexOf(id)
         const nextIds = ids.slice(removedIndex + 1)

         let _tops = cssProp.value.y === 'top' ? tops : bottoms

         _tops.slice(removedIndex + 1).forEach((prevTop, index) => {
            const newTop = prevTop - heights[removedIndex] - GAP + 'px'

            const item = getItem(nextIds[index])
            if (item) item.style = { [cssProp.value.y]: newTop }
         })
      }

      // Functions - Utils

      function createTimeout(id: string, time: number) {
         return setTimeout(() => setLeave(id), time)
      }

      function removeItem(id: string) {
         items.splice(
            items.findIndex((data) => data.id === id),
            1
         )
      }

      function getItem(id: string) {
         return items.find(({ id: _id }) => _id === id)
      }

      function getCtxProps({ title, message, type, id }: MergedOptions) {
         return { notifyProps: { title, message, type, close: () => setLeave(id) } }
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
                              id: item.id,
                              // @ts-ignore
                              ref: (_ref) => setRefs(_ref, item.id),
                              style: {
                                 transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                                 width: '100%',
                                 position: 'absolute',
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
