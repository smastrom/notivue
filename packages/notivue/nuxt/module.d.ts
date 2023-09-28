import * as _nuxt_schema from '@nuxt/schema'

/**
 * Strangely, if types are imported from `notivue`, they are not
 * recognized so they must be hardcoded. nuxt/ui seems to follow the same
 * approach.
 *
 * TODO: Update them on every release, substituting Ref<string> with string on
 * title/message and removing HTMLElement from teleportTo union
 */

type NotificationType =
   | 'success'
   | 'error'
   | 'info'
   | 'warning'
   | 'promise'
   | 'promise-resolve'
   | 'promise-reject'

type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right'

interface NotificationOptions {
   /** String to use as default title, an empty string doesn't render the title. */
   title?: string
   /** String to use as default message. */
   message?: string
   /** Duration of the notification. */
   duration?: number
   /** Value of `aria-live` attribute. */
   ariaLive?: 'polite' | 'assertive'
   /** Value of `role` attribute. */
   ariaRole?: 'alert' | 'status'
}

interface ModuleOptions {
   addPlugin?: boolean

   /** Whether to pause all notifications when hovering over them with mouse. */
   pauseOnHover?: boolean
   /** Whether to pause all notifications when tapping on them with touch devices. */
   pauseOnTouch?: boolean
   /** Whether to pause all notifications when switching tabs or window. */
   pauseOnTabChange?: boolean
   /** Wheter to enqueue notifications when limit is reached. */
   enqueue?: boolean
   /** Position of notifications, one of 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'. */
   position?: Position
   /** Notification options for each type. */
   notifications?: Partial<Record<NotificationType | 'global', NotificationOptions>>
   /** Animation classes for `enter`, `leave` and `clearAll`. */
   animations?: { enter?: string; leave?: string; clearAll?: string }
   /** Tag or element to which the stream will be teleported. */
   teleportTo?: string
   /** Notifications limit. Defaults to `Infinity`. */
   limit?: number
}

declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>

export { type ModuleOptions, _default as default }
