export default defineNuxtPlugin(() => {
   return {
      provide: {
         store: createStore(),
      },
   }
})
