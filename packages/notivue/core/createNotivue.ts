import type { App, InjectionKey, Plugin } from 'vue'
import type { NotivueConfig, NotivueStore } from 'notivue'

import { setPush, createPush as createPush } from './createPush'
import { createWatchers } from './createWatchers'
import {
   createConfig,
   createQueue,
   createItems,
   createElements,
   createAnimations,
   createTimeouts,
   createPushProxies,
} from './createStore'

export const notivueInjectionKey = Symbol('') as InjectionKey<NotivueStore>

export function createNotivue(userConfig: NotivueConfig = {}): Plugin {
   const config = createConfig(userConfig)
   const queue = createQueue()
   const items = createItems(config, queue)
   const elements = createElements()
   const animations = createAnimations(config, items, elements)
   const timeouts = createTimeouts(items, animations)

   const store = { config, queue, items, elements, animations, timeouts }

   const proxies = createPushProxies(store)
   const push = Object.freeze(createPush(proxies))

   setPush(push)

   createWatchers(store)

   const notivue = {
      install(app: App) {
         app.config.globalProperties.$push = push
         app.provide(notivueInjectionKey, store)
      },
   }

   return notivue
}
