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

it('It is not renderer if hideClose is true', () => {
   cy.mountNotifications({
      hideClose: true,
   })

      .clickAllStatic()

      .get(`.${Classes.CLOSE}`)
      .should('not.exist')
})
