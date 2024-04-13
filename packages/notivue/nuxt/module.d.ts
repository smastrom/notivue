import * as _nuxt_schema from '@nuxt/schema'

import type { NotificationType, NotificationOptions, NotivueConfig } from 'notivue'

type ModuleOptions = Omit<NotivueConfig, 'notifications'> & {
   startOnCreation?: boolean
   /**
    * Whether to create and inject the notivue store in the Vue app.
    * Equivalent of calling `createNotivue(app)` in the main.js of a non-nuxt app.
    */
   addPlugin?: boolean
   /** Notification options for each type. */
   notifications?: Partial<
      Record<
         NotificationType | 'global',
         Omit<NotificationOptions, 'title' | 'message'> & {
            /** String to use as default title, an empty string doesn't render the title. */
            title?: string
            /** String to use as default message. */
            message?: string
         }
      >
   >
}

declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>

export { type ModuleOptions, _default as default }
