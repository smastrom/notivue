import Notivue from './components/Notivue.vue'

import { Classes } from '@/Notifications/constants'

it('Close button dismisses notification', () => {
   cy.mount(Notivue)

      .get('.Success')
      .click()

      .get(`.${Classes.CLOSE}`)
      .click()
      .getNotifications()
      .should('have.length', 0)
})
