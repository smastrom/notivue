import './commands'
import { mount } from 'cypress/vue'
import { notivue } from '../../src'

import 'cypress-axe'

import '../../src/notifications.css'
import '../../src/animations.css'

type MountParams = Parameters<typeof mount>
type OptionsParam = MountParams[1]

declare global {
   namespace Cypress {
      interface Chainable {
         mount(component: any, options?: OptionsParam): Chainable<any>
      }
   }
}

Cypress.Commands.add('mount', (component, options = {}) => {
   options.global = options.global || {}
   options.global.plugins = options.global.plugins || []
   options.global.plugins.push(notivue)

   return mount(component, options)
})
