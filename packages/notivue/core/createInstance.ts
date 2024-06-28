import { readonly, ref } from 'vue'

import { createPushMock, setPush } from './createPush'
import { createStoreWatchers } from './createStoreWatchers'

import type { NotivueStore, Push } from 'notivue'

export let startInstance: () => void = () => {}
export let stopInstance: () => void = () => {}

export function createInstance(startOnCreation: boolean) {
   const isRunning = ref(startOnCreation)
   const isRunningReadonly = readonly(isRunning)

   function setupInstance(store: NotivueStore, push: Push) {
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

   return { isRunning: isRunningReadonly, setupInstance }
}
