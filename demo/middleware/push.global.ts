export default defineNuxtRouteMiddleware(() => {
   const push = usePush()

   push.info('Welcome to Notivue! Use the controls below to test it out.')
})
