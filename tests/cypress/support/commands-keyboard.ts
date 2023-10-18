import { mount } from 'cypress/vue'
import { notivuePlugin } from './utils'

import Notivue, { CyNotivueKeyboardProps } from '@/tests/NotivueKeyboard/components/Notivue.vue'

import { DEFAULT_ANIM_DURATION as ANIM_DUR } from '@/support/utils'

declare global {
   namespace Cypress {
      interface Chainable {
         mountKeyboard(props?: CyNotivueKeyboardProps): Chainable<any>
         pushCandidate(): Chainable<any>
         pushUnqualified(): Chainable<any>
         pushCandidateSilently(): Chainable<any>
         checkLeaveAnnouncement(): Chainable<any>
      }
   }
}

Cypress.Commands.add('mountKeyboard', (props = {} as CyNotivueKeyboardProps) => {
   return mount(Notivue, {
      global: {
         plugins: [notivuePlugin()],
      },
      props,
   })
})

Cypress.Commands.add('pushCandidate', () => cy.get('.PushCandidate').click().wait(ANIM_DUR))

Cypress.Commands.add('pushUnqualified', () => cy.get('.PushUnqualified').click().wait(ANIM_DUR))

Cypress.Commands.add('pushCandidateSilently', () => cy.get('body').type('{shift}c'))

Cypress.Commands.add('checkLeaveAnnouncement', () =>
   cy.get('.Notification').first().should('contain.text', "You're leaving the notifications stream")
)
