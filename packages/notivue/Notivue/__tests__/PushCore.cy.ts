import Push from './components/Push.vue'

import { defaultConfig } from '@/core/config'

describe('Push', () => {
   it('Can push any type of notification', () => {
      cy.mount(Push)

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

         .getNotification()
         .should('have.length', 5)
   })

   it('Dismisses any static notification', () => {
      cy.mount(Push)

         .get('.Success')
         .click()

         .get('.Error')
         .click()

         .get('.Info')
         .click()

         .get('.Warning')
         .click()

         .getNotification()
         .should('have.length', 4)

         .wait(defaultConfig.notifications.success.duration)

         .getNotification()
         .should('have.length', 0)
   })

   it('Updates and dismisses promises', () => {
      cy.mount(Push)

         .get('.RandomPromise')
         .click()

         .wait(defaultConfig.notifications.success.duration)

         .getNotification()
         .should('have.length', 0)
   })

   // TODO: Add tests for inline styles and classes
})
