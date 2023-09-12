import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
   interface NuxtConfig {
      ['notivue']?: ModuleOptions
   }
   interface NuxtOptions {
      ['notivue']?: ModuleOptions
   }
}

declare module 'nuxt/schema' {
   interface NuxtConfig {
      ['notivue']?: ModuleOptions
   }
   interface NuxtOptions {
      ['notivue']?: ModuleOptions
   }
}

export { ModuleOptions, default } from './module'
