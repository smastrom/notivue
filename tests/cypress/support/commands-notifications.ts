import { mount } from 'cypress/vue'

import { Classes } from '@/Notifications/constants'

import Notivue, { CyNotificationsProps } from '@/tests/Notifications/components/Notivue.vue'

import { createNotivue, type NotivueTheme, type NotivueConfig } from 'notivue'

declare global {
   namespace Cypress {
      interface Chainable {
         mountNotifications(props?: CyNotificationsProps, config?: NotivueConfig): Chainable<any>
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

Cypress.Commands.add('mountNotifications', (props = {}, config = {}) => {
   const notivue = createNotivue(config)

   return mount(Notivue, {
      global: {
         plugins: [notivue],
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
