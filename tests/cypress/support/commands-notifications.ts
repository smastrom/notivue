import { mount } from 'cypress/vue'
import { notivuePlugin } from './utils'

import { Classes } from '@/Notifications/constants'

import Notivue, { CyNotificationsProps } from '@/tests/Notifications/components/Notivue.vue'

import type { NotivueTheme } from 'notivue'

declare global {
   namespace Cypress {
      interface Chainable {
         mountNotifications(props?: CyNotificationsProps): Chainable<any>
         checkTheme(theme: NotivueTheme): Chainable<any>
         mountAndCheckTheme(theme: NotivueTheme): Chainable<any>
      }
   }
}

Cypress.Commands.add('checkTheme', (theme: NotivueTheme) => {
   Object.entries(theme).forEach(([key, value]) => {
      cy.get(`.${Classes.NOTIFICATION}`)
         .should('have.attr', 'style')
         .and('contain', `${key}: ${value}`)
   })
})

Cypress.Commands.add('mountNotifications', (props = {}) => {
   return mount(Notivue, {
      global: {
         plugins: [notivuePlugin()],
      },
      props,
   })
})

Cypress.Commands.add('mountAndCheckTheme', (theme: NotivueTheme) => {
   cy.mountNotifications({
      theme: theme,
   })

      .get('.Success')
      .click()
      .checkTheme(theme)
})
