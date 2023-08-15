export default defineNuxtPlugin(({ vueApp }) => {
   vueApp.provide(storeInjectionKey, createStore())
})
