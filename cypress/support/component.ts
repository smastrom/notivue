import './commands'

import { mount } from 'cypress/vue'

declare global {
   namespace Cypress {
      interface Chainable {
         mount: typeof mount
      }
   }
}

Cypress.Commands.add('mount', mount)
