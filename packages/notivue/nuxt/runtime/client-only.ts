import { defineComponent, onMounted, ref } from 'vue'

/**
 * This may seem unnecessary, however nuxt npm package doesn't
 * export the <ClientOnly /> component via an 'official', reliable path.
 *
 * Moreover, if setting 'mode: client' in addComponent() options
 * it throws a non-sense hydration mismatch warning in the console.
 *
 * This component is just a streamlined version of Nuxt's <ClientOnly />
 * which also relies on a onMounted boolean ref to render the slot.
 */

export const NotivueClientOnly = defineComponent({
   setup(_, { slots }) {
      const isMounted = ref(false)

      onMounted(() => (isMounted.value = true))

      return () => {
         if (!isMounted.value) return null

         return slots?.default?.()
      }
   },
})
