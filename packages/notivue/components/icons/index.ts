import { markRaw as raw, type SVGAttributes } from 'vue'

import { NotificationType as NType } from '../../core/constants'

import SuccessIcon from './SuccessIcon.vue'
import ErrorIcon from './ErrorIcon.vue'
import InfoIcon from './InfoIcon.vue'
import SuccessOutlineIcon from './SuccessOutlineIcon.vue'
import ErrorOutlineIcon from './ErrorOutlineIcon.vue'
import InfoOutlineIcon from './InfoOutlineIcon.vue'
import PromiseIcon from './PromiseIcon.vue'
import CloseIcon from './CloseIcon.vue'

import type { NotivueIcons } from '../../types'

export const svgProps: SVGAttributes = {
   xmlns: 'http://www.w3.org/2000/svg',
   width: 26,
   height: 26,
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
   [NType.SUCCESS]: raw(SuccessIcon),
   [NType.ERROR]: raw(ErrorIcon),
   [NType.INFO]: raw(InfoIcon),
   [NType.WARNING]: raw(ErrorIcon),
   [NType.PROMISE]: raw(PromiseIcon),
   [NType.PROMISE_RESOLVE]: raw(SuccessIcon),
   [NType.PROMISE_REJECT]: raw(ErrorIcon),
   close: raw(CloseIcon),
}

export const outlineIcons: NotivueIcons = {
   [NType.SUCCESS]: raw(SuccessOutlineIcon),
   [NType.ERROR]: raw(ErrorOutlineIcon),
   [NType.INFO]: raw(InfoOutlineIcon),
   [NType.WARNING]: raw(ErrorOutlineIcon),
   [NType.PROMISE]: raw(PromiseIcon),
   [NType.PROMISE_RESOLVE]: raw(SuccessOutlineIcon),
   [NType.PROMISE_REJECT]: raw(ErrorOutlineIcon),
   close: raw(CloseIcon),
}
