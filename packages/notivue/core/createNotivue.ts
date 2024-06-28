import type { App, Plugin } from 'vue'
import type { NotivueConfig } from 'notivue'

import { createPush } from './createPush'
import { notivueInjectionKey, notivueInstanceInjectionKey } from './symbols'
import { createInstance } from './createInstance'
import { createPushProxies, createStore } from './createStore'

export function createProvides(startOnCreation: boolean, userConfig: NotivueConfig) {
   const { setupInstance, isRunning } = createInstance(startOnCreation)

   const store = createStore(userConfig, isRunning)

   const proxies = createPushProxies(store)
   const push = Object.freeze(createPush(proxies))

   const instance = setupInstance(store, push)

   return {
      store,
      instance,
      push,
   }
}

export function createNotivue(
   pluginConfig: NotivueConfig & {
      startOnCreation?: boolean
   } = {}
): Plugin {
   return {
      install(app: App) {
         const { startOnCreation = true, ...userConfig } = pluginConfig
         const { store, instance, push } = createProvides(startOnCreation, userConfig)

         app.provide(notivueInstanceInjectionKey, instance)
         app.provide(notivueInjectionKey, store)

         app.config.globalProperties.$push ||= push
      },
   }
}
