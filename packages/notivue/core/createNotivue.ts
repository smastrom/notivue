import type { App, InjectionKey, Plugin } from 'vue'
import type { NotivueConfig, NotivueInstance, NotivueStore, Push } from 'notivue'

import { ref, readonly } from 'vue'
import { setPush, createPush, createPushMock } from './createPush'
import { createStoreWatchers } from './createStoreWatchers'
import {
   createConfig,
   createQueue,
   createItems,
   createElements,
   createAnimations,
   createTimeouts,
   createPushProxies,
} from './createStore'

export const notivueInstanceInjectionKey = Symbol('') as InjectionKey<NotivueInstance>
export const notivueInjectionKey = Symbol('') as InjectionKey<NotivueStore>

export function createNotivue(
   pluginConfig: NotivueConfig & {
      startOnCreation?: boolean
   } = {}
): Plugin {
   return {
      install(app: App) {
         const { startOnCreation = true, ...userConfig } = pluginConfig

         const { isRunning, runInstance } = createInstance(startOnCreation)

         const config = createConfig(userConfig, isRunning)
         const queue = createQueue()
         const items = createItems(config, queue)
         const elements = createElements()
         const animations = createAnimations(config, items, queue, elements)
         const timeouts = createTimeouts(items, animations)

         const store = { config, queue, items, elements, animations, timeouts }

         const proxies = createPushProxies(store)
         const push = Object.freeze(createPush(proxies))

         const instance = runInstance(store, push)

         app.provide(notivueInstanceInjectionKey, instance)
         app.provide(notivueInjectionKey, store)

         app.config.globalProperties.$push ||= push
      },
   }
}

export let startInstance: () => void = () => {}
export let stopInstance: () => void = () => {}

function createInstance(startOnCreation: boolean) {
   const isRunning = ref(startOnCreation)
   const isRunningReadonly = readonly(isRunning)

   function runInstance(store: NotivueStore, push: Push) {
      const watchStore = () => createStoreWatchers(store)

      if (startOnCreation) setPush(push)

      let unwatchStore = startOnCreation ? watchStore() : [() => {}]

      const instance = {
         isRunning: isRunningReadonly,
         startInstance() {
            if (isRunning.value) return

            setPush(push)
            unwatchStore = watchStore()

            isRunning.value = true
         },
         stopInstance() {
            if (!isRunning.value) return

            store.items.clear()
            store.queue.clear()
            store.items.clearLifecycleEvents()

            setPush(createPushMock())
            unwatchStore.forEach((unwatch) => unwatch())

            isRunning.value = false
         },
      }

      startInstance = () => instance.startInstance()
      stopInstance = () => instance.stopInstance()

      return instance
   }

   return { isRunning: isRunningReadonly, runInstance }
}
