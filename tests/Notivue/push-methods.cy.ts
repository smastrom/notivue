import { DEFAULT_DURATION } from '@/core/constants'
import { DEFAULT_ANIM_DURATION, RESOLVE_REJECT_DELAY } from '@/support/utils'

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

         .get('.PushPromiseAndResolve')
         .click()
         .wait(RESOLVE_REJECT_DELAY)
         .wait(DEFAULT_DURATION)

         .getNotifications()
         .should('have.length', 0)

         .get('.PushPromiseAndReject')
         .click()
         .wait(RESOLVE_REJECT_DELAY)
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
         .wait(RESOLVE_REJECT_DELAY)
         .wait(DEFAULT_ANIM_DURATION)

         .getNotifications()
         .should('have.length', 0)
   })

   it('Destroys single notification', () => {
      cy.mountNotivue()

         .get('.PushAndDestroy')
         .click()
         .wait(RESOLVE_REJECT_DELAY)

         .getNotifications()
         .should('have.length', 0)
   })
})
