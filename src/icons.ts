import { h } from 'vue'
import { NotificationType as NType } from './constants'
import { ReceiverProps } from './types'

const svgProps = {
   xmlns: 'http://www.w3.org/2000/svg',
   width: 26,
   height: 26,
   viewBox: '0 0 24 24',
   'aria-hidden': 'true',
}

const ionProps = {
   ...svgProps,
   fill: 'currentColor',
   viewBox: '0 0 12 12',
}

const featherProps = {
   ...svgProps,
   stroke: 'currentColor',
   'stroke-width': 2,
   'stroke-linecap': 'round',
   'stroke-linejoin': 'round',
}

const success = h('svg', ionProps, [
   h('path', {
      d: 'M6,-0c-3.308,-0 -6,2.692 -6,6c-0,3.308 2.692,6 6,6c3.308,-0 6,-2.692 6,-6c-0,-3.308 -2.692,-6 -6,-6Zm3.123,3.989l-3.877,4.616c-0.086,0.102 -0.213,0.162 -0.346,0.164l-0.008,0c-0.131,0 -0.256,-0.055 -0.343,-0.153l-1.662,-1.846c-0.081,-0.085 -0.126,-0.199 -0.126,-0.316c0,-0.254 0.209,-0.462 0.462,-0.462c0.135,0 0.263,0.059 0.35,0.161l1.307,1.451l3.536,-4.209c0.087,-0.101 0.215,-0.159 0.349,-0.159c0.253,-0 0.461,0.208 0.461,0.461c0,0.107 -0.036,0.21 -0.103,0.292Z',
   }),
])

const error = h('svg', ionProps, [
   h('path', {
      d: 'M6,-0c-3.308,-0 -6,2.692 -6,6c-0,3.308 2.692,6 6,6c3.308,-0 6,-2.692 6,-6c-0,-3.308 -2.692,-6 -6,-6Zm-0,9.228c-0.316,0 -0.577,-0.26 -0.577,-0.577c0,-0.316 0.261,-0.577 0.577,-0.577c0.316,0 0.577,0.261 0.577,0.577c-0,0.317 -0.261,0.577 -0.577,0.577Zm0.627,-5.802l-0.166,3.519c-0,0.253 -0.208,0.462 -0.462,0.462c-0.253,-0 -0.461,-0.209 -0.461,-0.462l-0.166,-3.518l0,-0.001c-0,-0.009 -0,-0.018 -0,-0.027c-0,-0.344 0.283,-0.627 0.627,-0.627c0.344,0 0.627,0.283 0.627,0.627c-0,0.009 -0,0.018 -0.001,0.027l0.002,-0Z',
   }),
])

const info = h('svg', ionProps, [
   h('path', {
      d: 'M6,0c-3.308,0 -6,2.692 -6,6c0,3.308 2.692,6 6,6c3.308,0 6,-2.692 6,-6c0,-3.308 -2.692,-6 -6,-6Zm0,2.46c0.428,0 0.78,0.352 0.78,0.78c-0,0.428 -0.352,0.78 -0.78,0.78c-0.428,0 -0.78,-0.352 -0.78,-0.78c0,-0.428 0.352,-0.78 0.78,-0.78Zm1.44,6.78l-2.64,0c-0.263,0 -0.48,-0.217 -0.48,-0.48c0,-0.263 0.217,-0.48 0.48,-0.48l0.84,0l0,-2.64l-0.48,0c-0.263,0 -0.48,-0.217 -0.48,-0.48c0,-0.263 0.217,-0.48 0.48,-0.48l0.96,0c0.263,0 0.48,0.217 0.48,0.48l0,3.12l0.84,0c0.263,0 0.48,0.217 0.48,0.48c0,0.263 -0.217,0.48 -0.48,0.48Z',
   }),
])

const successOutline = h('svg', ionProps, [
   h('path', {
      d: 'M11.963,6.037c-0,3.292 -2.671,5.963 -5.963,5.963c-3.292,0 -5.963,-2.671 -5.963,-5.963c0,-3.292 2.671,-5.962 5.963,-5.962c3.292,-0 5.963,2.67 5.963,5.962Zm-0.918,0c0,-2.785 -2.26,-5.045 -5.045,-5.045c-2.785,0 -5.045,2.26 -5.045,5.045c-0,2.786 2.26,5.046 5.045,5.046c2.785,-0 5.045,-2.26 5.045,-5.046Z',
   }),
   h('path', {
      d: 'M8.401,3.449c0.163,-0.194 0.452,-0.219 0.646,-0.056c0.194,0.163 0.219,0.452 0.056,0.646l-3.853,4.587c-0.085,0.101 -0.21,0.161 -0.343,0.163c-0.133,0.003 -0.26,-0.053 -0.349,-0.151l-1.651,-1.835c-0.169,-0.188 -0.154,-0.479 0.034,-0.648c0.188,-0.169 0.479,-0.154 0.648,0.034l1.298,1.443l3.514,-4.183Z',
   }),
])

const errorOutline = h('svg', ionProps, [
   h('path', {
      d: 'M12, 6c0, 3.313 -2.687, 6 -6, 6c-3.313,-0 -6,-2.688 -6,-6c0,-3.313 2.688,-6 6,-6c3.313,-0 6,2.687 6,6Zm-0.923,-0c-0,-2.803 -2.274,-5.077 -5.077,-5.077c-2.803,0 -5.077,2.274 -5.077,5.077c0,2.803 2.274,5.077 5.077,5.077c2.803,-0 5.077,-2.274 5.077,-5.077Z',
   }),
   h('path', {
      d: 'M5.373,3.426c-0,-0.009 -0,-0.019 -0,-0.028c-0,-0.342 0.279,-0.624 0.621,-0.627c0.002,-0 0.004,-0 0.006,-0c0.344,-0 0.627,0.283 0.627,0.627c-0,0.009 -0,0.019 -0.001,0.028l0,0.001l-0.165,3.518c-0.012,0.246 -0.215,0.44 -0.461,0.44c-0.246,-0 -0.449,-0.194 -0.461,-0.44l-0.166,-3.518l0,-0.001Z',
   }),
   h('path', {
      d: 'M6,9.228c-0.316,0 -0.577,-0.26 -0.577,-0.577c0,-0.316 0.261,-0.577 0.577,-0.577c0.316,0 0.577,0.261 0.577,0.577c-0,0.317 -0.261,0.577 -0.577,0.577Z',
   }),
])

const infoOutline = h('svg', ionProps, [
   h('path', {
      d: 'M6, 0c3.313, 0 6, 2.687 6, 6c-0, 3.313 -2.687, 6 -6, 6c-3.313,-0 -6,-2.687 -6,-6c0,-3.313 2.687,-6 6,-6Zm0, 0.96c-2.783, 0 -5.04, 2.257 -5.04, 5.04c0, 2.783 2.257, 5.04 5.04, 5.04c2.783, 0 5.04,-2.257 5.04,-5.04c-0,-2.783 -2.257,-5.04 -5.04,-5.04Z',
   }),
   h('path', {
      d: 'M6.6, 8.28l0.84, 0c0.265, 0 0.48, 0.215 0.48, 0.48c-0, 0.265 -0.215, 0.48 -0.48, 0.48l-2.64,-0c-0.265, 0 -0.48,-0.215 -0.48,-0.48c-0,-0.265 0.215,-0.48 0.48,-0.48l0.84, 0l-0,-2.64l-0.48, 0c-0.265, 0 -0.48,-0.215 -0.48,-0.48c-0,-0.265 0.215,-0.48 0.48,-0.48l0.96, 0c0.265, 0 0.48, 0.215 0.48, 0.48l-0, 3.12Z',
   }),
   h('path', {
      d: 'M6, 2.46c-0.428, 0 -0.78, 0.352 -0.78, 0.78c-0, 0.428 0.352, 0.78 0.78, 0.78c0.428, 0 0.78,-0.352 0.78,-0.78c-0,-0.428 -0.352,-0.78 -0.78,-0.78Z',
   }),
])

const promise = h('svg', { ...svgProps, width: 28, height: 28, fill: 'currentColor' }, [
   h('path', {
      d: 'M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z',
      opacity: '.25',
   }),
   h(
      'path',
      {
         d: 'M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z',
      },
      h('animateTransform', {
         attributeName: 'transform',
         type: 'rotate',
         dur: '0.75s',
         values: '0 12 12; 360 12 12',
         repeatCount: 'indefinite',
      })
   ),
])

export const close = h('svg', featherProps, [
   h('line', { x1: 18, y1: 6, x2: 6, y2: 18 }),
   h('line', { x1: 6, y1: 6, x2: 18, y2: 18 }),
])

export const icons: ReceiverProps['icons'] = {
   [NType.SUCCESS]: () => success,
   [NType.ERROR]: () => error,
   [NType.INFO]: () => info,
   [NType.WARNING]: () => error,
   [NType.PROMISE]: () => promise,
   [NType.PROMISE_RESOLVE]: () => success,
   [NType.PROMISE_REJECT]: () => error,
   close: () => close,
}

export const outlineIcons: ReceiverProps['icons'] = {
   [NType.SUCCESS]: () => successOutline,
   [NType.ERROR]: () => errorOutline,
   [NType.INFO]: () => infoOutline,
   [NType.WARNING]: () => errorOutline,
   [NType.PROMISE]: () => promise,
   [NType.PROMISE_RESOLVE]: () => successOutline,
   [NType.PROMISE_REJECT]: () => errorOutline,
   close: () => close,
}
