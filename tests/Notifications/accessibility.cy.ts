import { Classes } from '@/Notifications/constants'

it('All elements are accessible', () => {
   cy.mountNotifications({
      options: {
         ariaRole: 'alert',
         ariaLive: 'assertive',
      },
   })

      .get('.Success')
      .click()

   cy.injectAxe({ axeCorePath: '../node_modules/axe-core/axe.min.js' })
   cy.checkA11y(`.${Classes.NOTIFICATION}`)

   cy.get('.Notivue__content')
      .should('have.attr', 'role', 'alert')
      .and('have.attr', 'aria-live', 'assertive')
})
