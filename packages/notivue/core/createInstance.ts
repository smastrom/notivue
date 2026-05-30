import type { NotivueConfigUpdateParam, NotivueStore, Notify } from 'notivue'

import { readonly, ref } from 'vue'

import { createNotifyMock, setNotify } from './createNotify'
import { createStoreWatchers } from './createStoreWatchers'

export let startInstance: (config?: NotivueConfigUpdateParam) => void = () => {}
export let stopInstance: () => void = () => {}

export function createInstance(startOnCreation: boolean) {
   const isRunning = ref(startOnCreation)
   const isRunningReadonly = readonly(isRunning)

   function setupInstance(store: NotivueStore, notify: Notify) {
      const watchStore = () => createStoreWatchers(store)

      if (startOnCreation) setNotify(notify)

      let unwatchStore = startOnCreation ? watchStore() : [() => {}]

      const instance = {
         isRunning: isRunningReadonly,
         startInstance(config?: NotivueConfigUpdateParam) {
            if (isRunning.value) return

            setNotify(notify)

            unwatchStore = watchStore()

            isRunning.value = true

            if (config !== undefined) store.config.update(config)
         },
         stopInstance() {
            if (!isRunning.value) return

            store.items.clear()
            store.queue.clear()
            store.items.clearLifecycleEvents()

            setNotify(createNotifyMock())
            unwatchStore.forEach((unwatch) => unwatch())

            isRunning.value = false
         },
      }

      startInstance = (config?: NotivueConfigUpdateParam) => instance.startInstance(config)
      stopInstance = () => instance.stopInstance()

      return instance
   }

   return { isRunning: isRunningReadonly, setupInstance }
}
