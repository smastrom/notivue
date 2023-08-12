import { DEFAULT_DURATION } from '@/core/constants'

import Notivue from './components/Notivue.vue'

describe('Push', () => {
   it('Can push any type of notification', () => {
      cy.mount(Notivue)
         .clickAll()

         .getNotifications()
         .should('have.length', 5)
   })

   it('Dismisses any static notification', () => {
      cy.mount(Notivue)
         .clickAllStatic()

         .getNotifications()
         .should('have.length', 4)

         .wait(DEFAULT_DURATION)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Updates and dismisses promises', () => {
      cy.mount(Notivue)

         .get('.RandomPromise')
         .click()

         .wait(DEFAULT_DURATION)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Clears all notifications', () => {
      cy.mount(Notivue)
         .clickAll()

         .get('.ClearAll')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroys all notifications', () => {
      cy.mount(Notivue)
         .clickAll()

         .get('.DestroyAll')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Clears single notification', () => {
      cy.mount(Notivue)

         .get('.PushAndClear')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroys single notification', () => {
      cy.mount(Notivue)

         .get('.PushAndDestroy')
         .click()

         .getNotifications()
         .should('have.length', 0)
   })
})
