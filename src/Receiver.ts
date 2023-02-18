import {
   defineComponent,
   h,
   Teleport,
   toRef,
   Transition,
   TransitionGroup,
   watch,
   type PropType,
} from 'vue'
import { useReceiver } from './useReceiver'
import { useReceiverStyles } from './useReceiverStyles'
import { getOrigin, mergeOptions } from './utils'
import { NType, FIXED_INCREMENT } from './constants'
import { defaultComponent } from './defaultComponent'
import { defaultOptions } from './defaultOptions'
import { ariaLive } from './ariaLive'
import { light } from './themes'
import type { ReceiverProps as Props, MergedOptions, Notification } from './types'

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
      transitionName: {
         type: String as PropType<Props['transitionName']>,
         default: 'VNRoot',
      },
      transitionGroupName: {
         type: String as PropType<Props['transitionGroupName']>,
         default: 'VNList',
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

      let unsubscribe = subscribe()

      watch(disabled, (isDisabled) => {
         if (isDisabled) {
            items.length = 0
            unsubscribe()
         } else {
            unsubscribe = subscribe()
         }
      })

      watch(
         () => items.length === 0,
         (newLen) => newLen && (isHovering = false),
         { flush: 'post' }
      )

      // Functions

      function subscribe() {
         return watch(incoming, (_options) => {
            const isUnshift = props.method === 'unshift'

            if (
               items.length >= props.limit &&
               items[isUnshift ? items.length - 1 : 0].type !== NType.PROMISE
            ) {
               items[isUnshift ? 'pop' : 'shift']()
            }

            const options = mergeOptions(props.options, _options)
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
                  clear: () => clear(options.id),
                  createdAt,
               } as Notification)
            }
         })
      }

      function createTimeout(id: string, time: number) {
         return setTimeout(() => {
            items.find((data) => data.id === id)?.clear()
         }, time)
      }

      function clear(id: string) {
         items.splice(
            items.findIndex((data) => data.id === id),
            1
         )
      }

      function getNotifyProps({ title, message, type, id }: MergedOptions) {
         return { notifyProps: { title, message, type, close: () => clear(id) } }
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

      return () =>
         /* prettier-ignore */
         h(Teleport, { to: 'body' }, [
            h(Transition, {
               name: props.transitionName,
               onEnter(el) {
                     (el as HTMLElement).style.transformOrigin = getOrigin(
                        el as HTMLElement,
                        position
                     );
                  },
               },
               () => items.length > 0 &&
                  h('div', { style: wrapperStyles },
                     h('div', { style: containerStyles.value },
                        h('div',
                           {
                              style: {...hoverAreaStyles, ...props.theme},
                              ...(props.pauseOnHover ? pointerEvts : {}),
                              ...(props.id ? { 'data-vuenotify': props.id } : {}),
                           },
                           h(TransitionGroup, { name: props.transitionGroupName }, () =>
                              items.map((item) => [
                                 h('div', { key: item.id }, [
                                    item.h?.() ?? defaultComponent(item),
                                    ariaLive(item),
                                 ]),
                              ])
                           )
                        )
                     )
                  )
            ),
         ])
   },
})
