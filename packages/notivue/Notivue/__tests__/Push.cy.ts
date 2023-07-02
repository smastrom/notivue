import Notivue from './components/Notivue.vue'

import { defaultConfig } from '@/core/config'

describe('Push', () => {
   it('Can push any type of notification', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()

         .get('.Error')
         .click()

         .get('.Info')
         .click()

         .get('.Warning')
         .click()

         .get('.Promise')
         .click()

         .getNotifications()
         .should('have.length', 5)
   })

   it('Dismisses any static notification', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()

         .get('.Error')
         .click()

         .get('.Info')
         .click()

         .get('.Warning')
         .click()

         .getNotifications()
         .should('have.length', 4)

         .wait(defaultConfig.notifications.success.duration)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Updates and dismisses promises', () => {
      cy.mount(Notivue)

         .get('.RandomPromise')
         .click()

         .wait(defaultConfig.notifications.success.duration)

         .getNotifications()
         .should('have.length', 0)
   })
})
