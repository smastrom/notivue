/// <reference types="cypress" />

import { mount } from 'cypress/vue'
import { NotivueConfig } from 'index'
import { notivueCypress } from '@/core/plugin'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

declare global {
   namespace Cypress {
      interface Chainable {
         mount(
            component: any,
            notivueOptions?: NotivueConfig,
            options?: OptionsParam
         ): Chainable<any>
      }
   }
}

Cypress.Commands.add('mount', (component, notivueOptions: NotivueConfig = {}, options = {}) => {
   options.global = options.global || {}
   options.global.plugins = options.global.plugins || []
   options.global.plugins.push(notivueCypress(notivueOptions))

   return mount(component, options)
})
