import type { App, Plugin } from 'vue'
import type { NotivueConfig } from 'notivue'

import { createNotify } from './createNotify'
import { notivueInjectionKey, notivueInstanceInjectionKey } from './symbols'
import { createInstance } from './createInstance'
import { createNotifyProxies, createStore } from './createStore'

export function createProvides(startOnCreation: boolean, userConfig: NotivueConfig) {
   const { setupInstance, isRunning } = createInstance(startOnCreation)

   const store = createStore(userConfig, isRunning)

   const proxies = createNotifyProxies(store)
   const notify = Object.freeze(createNotify(proxies))

   const instance = setupInstance(store, notify)

   return {
      store,
      instance,
      notify,
      push: notify, // Legacy alias for backwards compatibility
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
         const { store, instance, notify } = createProvides(startOnCreation, userConfig)

         app.provide(notivueInstanceInjectionKey, instance)
         app.provide(notivueInjectionKey, store)

         app.config.globalProperties.$notify ||= notify
         app.config.globalProperties.$push ||= notify
      },
   }
}
