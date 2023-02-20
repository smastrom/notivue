import { defineComponent, h, toRef, nextTick, Teleport, watch, type PropType } from 'vue'
import { useReceiver } from './useReceiver'
import { useReceiverStyles } from './useReceiverStyles'
import { mergeOptions } from './utils'
import { NType, FIXED_INCREMENT } from './constants'
import { defaultComponent } from './defaultComponent'
import { defaultOptions } from './defaultOptions'
import { ariaLive } from './ariaLive'
import { useRefsMap } from './useRefsMap'
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
      method: {
         type: String as PropType<Props['method']>,
         default: 'unshift',
      },
      limit: {
         type: Number as PropType<Props['limit']>,
         default: 10,
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
         default: 0,
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

      // Reactivity

      const position = toRef(props, 'position')
      const rootMargin = toRef(props, 'rootMargin')
      const maxWidth = toRef(props, 'maxWidth')
      const disabled = toRef(props, 'disabled')

      const { items, incoming } = useReceiver(props.id)
      const { wrapperStyles, containerStyles, hoverAreaStyles } = useReceiverStyles({
         rootMargin,
         maxWidth,
         position,
      })

      // Watchers

      const { refs, setRefs } = useRefsMap()

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

      watch(
         () => items.length === 0,
         (isCleared) => isCleared && (isHovering = false),
         { flush: 'post' }
      )

      // Functions

      function subscribe() {
         return watch(incoming, (pushOptions) => {
            const isUnshift = props.method === 'unshift'

            if (
               items.length >= props.limit &&
               items[isUnshift ? items.length - 1 : 0].type !== NType.PROMISE
            ) {
            }

            const options = mergeOptions(props.options, pushOptions)
            const createdAt = performance.now()

            let customRender: Partial<Pick<Notification, 'props' | 'component' | 'h'>> = {
               h: undefined,
            }

            if (
               options.type.includes(NType.PROMISE_REJECT) ||
               options.type.includes(NType.PROMISE_RESOLVE)
            ) {
               const currIndex = items.findIndex((data) => data.id === options.id)
               const prevComponent = items[currIndex]?.component

               if (prevComponent) {
                  const { title, message, type, close, ...prevProps } = items[currIndex].props
                  const nextProps = { ...getNotifyProps(options), prevProps }

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
                  timeoutId: isHovering ? undefined : createTimeout(options.id, options.duration),
                  createdAt,
               }
            } else {
               const component = options.render?.component

               if (component) {
                  const props = options.render?.props?.(getNotifyProps(options)) ?? {}
                  customRender = {
                     h: () => h(component, props),
                     ...(options.type === NType.PROMISE ? { props, component } : {}),
                  }
               }

               items[props.method]({
                  ...options,
                  ...customRender,
                  timeoutId:
                     options.type !== NType.PROMISE && createTimeout(options.id, options.duration),
                  clear: () => onLeave(options.id),
                  createdAt,
               } as Notification)

               nextTick(() => onEnter(options.id))
            }
         })
      }

      function createTimeout(id: string, time: number) {
         return setTimeout(() => {
            items.find((data) => data.id === id)?.clear()
         }, time)
      }

      function splice(id: string) {
         items.splice(
            items.findIndex((data) => data.id === id),
            1
         )
      }

      function getNotifyProps({ title, message, type, id }: MergedOptions) {
         return { notifyProps: { title, message, type, close: () => onLeave(id) } }
      }

      // Props

      const pointerEvts = {
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

      const PADDING_TOP = 20
      const GAP = 10

      function getItem(id: string) {
         return items.find(({ id: _id }) => _id === id)
      }

      function getRefs() {
         const sortedEntries = Array.from(refs.entries()).sort(([, prev], [, next]) => {
            return prev.value.getBoundingClientRect().y - next.value.getBoundingClientRect().y
         })

         return {
            ids: sortedEntries.map(([id]) => id),
            tops: sortedEntries.map(([, ref]) => ref.value.getBoundingClientRect().y),
            heights: sortedEntries.map(([, ref]) => ref.value.getBoundingClientRect().height),
         }
      }

      function onEnter(id: string) {
         const currItem = getItem(id)
         if (currItem) {
            currItem.animationClass = 'VNEnter'
            currItem.onAnimationend = () => {
               currItem.animationClass = ''
               nextTick(() => (currItem.onAnimationend = undefined))
            }
         }

         const sortedRefs = getRefs()

         sortedRefs.ids.forEach((_id, index) => {
            const prevDistance = sortedRefs.heights
               .slice(0, index)
               .reduce((acc, curr) => acc + curr, 0)

            const newTop = PADDING_TOP + prevDistance + GAP * index + 'px'
            const currItem = getItem(_id)
            if (currItem) currItem.style = { top: newTop }
         })
      }

      function onLeave(id: string) {
         const currItem = getItem(id)
         if (currItem) {
            currItem.animationClass = 'VNLeave'
            currItem.onAnimationend = () => splice(id)
         }

         const sortedRefs = getRefs()

         const removedIndex = sortedRefs.ids.indexOf(id)
         const nextIds = sortedRefs.ids.slice(removedIndex + 1)

         sortedRefs.tops.slice(removedIndex + 1).forEach((prevTop, index) => {
            const newTop = prevTop - sortedRefs.heights[removedIndex] - GAP + 'px'
            const currItem = getItem(nextIds[index])
            if (currItem) currItem.style = { top: newTop }
         })
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
                        /* ...(props.pauseOnHover ? pointerEvts : {}), */
                        ...(props.id ? { 'data-vuenotify-id': props.id } : {}),
                     },
                     h(
                        'div',
                        {
                           style: {
                              ...hoverAreaStyles,
                              position: 'relative',
                           },
                        },
                        [
                           items.map((item) =>
                              h(
                                 'div',
                                 {
                                    key: item.id,
                                    id: item.id,
                                    ref: (_ref) => {
                                       // @ts-ignore
                                       setRefs(_ref, item.id)
                                    },
                                    style: {
                                       height: 'auto',
                                       transition: 'top 300ms cubic-bezier(0.22, 1, 0.36, 1)',
                                       position: 'absolute',
                                       ...item.style,
                                    },
                                 },
                                 [item.h?.() ?? defaultComponent(item), ariaLive(item)]
                              )
                           ),
                        ]
                     )
                  )
               ),
         ])
   },
})
