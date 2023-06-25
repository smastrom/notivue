import { computed } from 'vue'

import { defaultOptions } from './options'
import { toWritableRefs, mergeDeep } from './utils'

import { CLASS_PREFIX as CX } from './constants'

import type { NotivueConfig, DeepPartial } from '../types'

export const defaultConfig: NotivueConfig = {
   pauseOnHover: true,
   pauseOnTouch: true,
   position: 'top-center',
   teleportTo: 'body',
   class: '',
   options: defaultOptions,
   animations: { enter: CX + 'enter', leave: CX + 'leave', clearAll: CX + 'clearAll' },
   theme: {},
   icons: {},
}

export function getConfig(userConfig: DeepPartial<NotivueConfig>) {
   const reactiveConfig = toWritableRefs(mergeDeep(defaultConfig, userConfig) as NotivueConfig)

   return {
      ...reactiveConfig,
      isTopAlign: computed(() => reactiveConfig.position.value.startsWith('top')),
   }
}
