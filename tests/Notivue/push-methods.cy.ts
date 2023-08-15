import { DEFAULT_DURATION } from '@/core/constants'

describe('Push', () => {
   it('Can push any type of notification', () => {
      cy.mountNotivue()
         .clickAll()

         .getNotifications()
         .should('have.length', 5)
   })

   it('Dismisses any static notification', () => {
      cy.mountNotivue()
         .clickAllStatic()

         .getNotifications()
         .should('have.length', 4)

         .wait(DEFAULT_DURATION)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Updates and dismisses promises', () => {
      cy.mountNotivue()

         .get('.RandomPromise')
         .click()

         .wait(DEFAULT_DURATION)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Clears all notifications', () => {
      cy.mountNotivue()
         .clickAll()

         .get('.ClearAll')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroys all notifications', () => {
      cy.mountNotivue()
         .clickAll()

         .get('.DestroyAll')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Clears single notification', () => {
      cy.mountNotivue()

         .get('.PushAndClear')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroys single notification', () => {
      cy.mountNotivue()

         .get('.PushAndDestroy')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
