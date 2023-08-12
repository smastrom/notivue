import { Classes } from '@/Notifications/constants'

import Notivue, { CyNotificationsProps } from '@/tests/Notifications/components/Notivue.vue'

import type { NotivueConfig, NotivueTheme } from 'notivue'

type MountNotificationsOptions = { config?: NotivueConfig; props?: CyNotificationsProps }

declare global {
   namespace Cypress {
      interface Chainable {
         mountNotifications(options?: MountNotificationsOptions): Chainable<any>
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

Cypress.Commands.add(
   'mountNotifications',
   ({ config = {}, props = {} }: MountNotificationsOptions = { config: {}, props: {} }) => {
      cy.mount<CyNotificationsProps>(Notivue, {
         config,
         props,
      })
   }
)

Cypress.Commands.add('mountAndCheckTheme', (theme: NotivueTheme) => {
   cy.mountNotifications({
      props: {
         theme: theme,
      },
   })

      .get('.Success')
      .click()
      .checkTheme(theme)
})
