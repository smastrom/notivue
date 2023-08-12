import { Classes } from '@/Notifications/constants'

import type { NotivueTheme } from 'notivue'
import type { Component } from 'vue'

declare global {
   namespace Cypress {
      interface Chainable {
         checkTheme(theme: NotivueTheme): Chainable<any>
         mountAndCheckTheme(component: Component, theme: NotivueTheme): Chainable<any>
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

Cypress.Commands.add('mountAndCheckTheme', (Component: Component, theme: NotivueTheme) => {
   cy.mount(
      Component,
      { config: {} },
      {
         props: {
            theme: theme,
         } as any,
      }
   )

      .get('.Success')
      .click()
      .checkTheme(theme)
})
