import { Classes } from '@/Notifications/constants'

it('Close button dismisses notification', () => {
   cy.mountNotifications()

      .get('.Success')
      .click()

      .get(`.${Classes.CLOSE}`)
      .click()
      .getNotifications()
      .should('have.length', 0)
})
