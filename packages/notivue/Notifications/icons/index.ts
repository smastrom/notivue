import CloseIcon from './CloseIcon.vue'
import ErrorIcon from './ErrorIcon.vue'
import ErrorOutlineIcon from './ErrorOutlineIcon.vue'
import InfoIcon from './InfoIcon.vue'
import InfoOutlineIcon from './InfoOutlineIcon.vue'
import PromiseIcon from './PromiseIcon.vue'
import SuccessIcon from './SuccessIcon.vue'
import SuccessOutlineIcon from './SuccessOutlineIcon.vue'

import type { NotivueIcons } from 'notivue'

import { markRaw as raw, type SVGAttributes } from 'vue'

import { NotificationTypeKeys as NType } from '@/core/constants'

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
   [NType.SUCCESS]: raw(SuccessIcon),
   [NType.ERROR]: raw(ErrorIcon),
   [NType.INFO]: raw(InfoIcon),
   [NType.WARNING]: raw(ErrorIcon),
   [NType.LOADING]: raw(PromiseIcon),
   [NType.LOADING_SUCCESS]: raw(SuccessIcon),
   [NType.LOADING_ERROR]: raw(ErrorIcon),
   close: raw(CloseIcon),
}

export const outlinedIcons: NotivueIcons = {
   [NType.SUCCESS]: raw(SuccessOutlineIcon),
   [NType.ERROR]: raw(ErrorOutlineIcon),
   [NType.INFO]: raw(InfoOutlineIcon),
   [NType.WARNING]: raw(ErrorOutlineIcon),
   [NType.LOADING]: raw(PromiseIcon),
   [NType.LOADING_SUCCESS]: raw(SuccessOutlineIcon),
   [NType.LOADING_ERROR]: raw(ErrorOutlineIcon),
   close: raw(CloseIcon),
}
