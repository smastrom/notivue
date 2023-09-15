import type { NotivueItem } from 'notivue'

export interface NotivueSwipeProps {
   /** Notivue's exposed notification item. */
   item: NotivueItem
   /**
    * Whether to enable clear on swipe only on touch interactions.
    */
   touchOnly?: boolean
   /**
    * A [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
    * string that specifies elements to be exempted from the swipe action.
    *
    * @default "a, button"
    */
   exclude?: string
   /**
    * Whether to disable the swipe gesture or not.
    * Useful for disabling the behavior on desktop devices, for example.
    *
    * @default false
    */
   disabled?: boolean
   /**
    * Fraction of notification's width needed to be swiped for clearing.
    * For instance, a threshold of 0.5 indicates 50% of the notification's width must be swiped.
    *
    * @default 0.5
    */
   threshold?: number
   /**
    * Whether to call the 'destroy' item method instead of 'clear' when
    * the swipe threshold is met.
    *
    * @default false
    */
   destroy?: boolean
}
