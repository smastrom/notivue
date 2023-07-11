import { markRaw as raw, type SVGAttributes } from 'vue'

import { NotificationTypeKeys as NKeys } from '@/core/constants'

import SuccessIcon from './SuccessIcon.vue'
import ErrorIcon from './ErrorIcon.vue'
import InfoIcon from './InfoIcon.vue'
import SuccessOutlineIcon from './SuccessOutlineIcon.vue'
import ErrorOutlineIcon from './ErrorOutlineIcon.vue'
import InfoOutlineIcon from './InfoOutlineIcon.vue'
import PromiseIcon from './PromiseIcon.vue'
import CloseIcon from './CloseIcon.vue'

import type { NotivueIcons } from 'notivue'

export const svgProps: SVGAttributes = {
   xmlns: 'http://www.w3.org/2000/svg',
   viewBox: '0 0 24 24',
   'aria-hidden': 'true',
}

export const ionProps: SVGAttributes = {
   ...svgProps,
   fill: 'currentColor',
   viewBox: '0 0 12 12',
}

export const featherProps: SVGAttributes = {
   ...svgProps,
   stroke: 'currentColor',
   'stroke-width': 2,
   'stroke-linecap': 'round',
   'stroke-linejoin': 'round',
}

export const filledIcons: NotivueIcons = {
   [NKeys.SUCCESS]: raw(SuccessIcon),
   [NKeys.ERROR]: raw(ErrorIcon),
   [NKeys.INFO]: raw(InfoIcon),
   [NKeys.WARNING]: raw(ErrorIcon),
   [NKeys.PROMISE]: raw(PromiseIcon),
   [NKeys.PROMISE_RESOLVE]: raw(SuccessIcon),
   [NKeys.PROMISE_REJECT]: raw(ErrorIcon),
   close: raw(CloseIcon),
}

export const outlinedIcons: NotivueIcons = {
   [NKeys.SUCCESS]: raw(SuccessOutlineIcon),
   [NKeys.ERROR]: raw(ErrorOutlineIcon),
   [NKeys.INFO]: raw(InfoOutlineIcon),
   [NKeys.WARNING]: raw(ErrorOutlineIcon),
   [NKeys.PROMISE]: raw(PromiseIcon),
   [NKeys.PROMISE_RESOLVE]: raw(SuccessOutlineIcon),
   [NKeys.PROMISE_REJECT]: raw(ErrorOutlineIcon),
   close: raw(CloseIcon),
}
