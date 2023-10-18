import { createElementBlock, defineComponent, onMounted, ref } from 'vue'

/**
 * This is a streamlined version of Nuxt's <ClientOnly />
 * which like it also relies on a boolean ref to render the slot.
 *
 * While this is unnecessary for client-only apps but definetely required
 * for Nuxt apps, users may still be using 'vite-plugin-ssr' or whatever
 * non-nuxt SSR solution.
 *
 * This universally removes any chance of SSR issues when importing
 * <Notivue /> and <NotivueKeyboard /> while keeping the internal
 * store code clean without adding a bunch of (isSSR) checks.
 */

export const NotivueClientOnly = defineComponent({
   setup(_, { slots, attrs }) {
      const isMounted = ref(false)

      onMounted(() => (isMounted.value = true))

      return () => {
         if (isMounted.value) return slots.default?.()

         return createElementBlock('span', attrs, '')
      }
   },
})
