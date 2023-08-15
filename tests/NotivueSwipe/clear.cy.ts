import {
   SWIPE_NOTIFICATION_WIDTH as WIDTH,
   DEFAULT_ENTER_LEAVE_ANIM_DURATION as ANIM_DUR,
} from '@/support/utils'

describe('Default behavior', () => {
   it('Should clear notification when default threshold is met', () => {
      cy.mountSwipe()
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .realSwipe('toLeft', { length: WIDTH / 2 })

         .get('.SwipeNotification')
         .should('not.exist')
   })

   it('Should clear notification by swiping left', () => {
      cy.mountSwipe().pushSwipeSuccess()

      cy.get('.SwipeNotification')
         .realSwipe('toLeft', { length: WIDTH / 2 })

         .get('.SwipeNotification')
         .should('not.exist')
   })

   it('Should clear notification by swiping right', () => {
      cy.mountSwipe().pushSwipeSuccess()

      cy.get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH / 2 })

         .get('.SwipeNotification')
         .should('not.exist')
   })

   it('Should not clear if threshold is not met', () => {
      cy.mountSwipe()
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH * 0.3 })

         .get('.SwipeNotification')
         .should('exist')
   })

   it('Should not swipe if it is a promise', () => {
      cy.mountSwipe()
         .get('.Promise')
         .click()
         .wait(ANIM_DUR)

         .get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH * 3 })

         .get('.SwipeNotification')
         .should('exist')
   })

   describe('Should not clear notification if swiping a button or a link', () => {
      it('Button', () => {
         cy.mountSwipe()
            .pushSwipeSuccess()

            .get('.CloseButton')
            .realSwipe('toRight', { length: WIDTH })

            .get('.SwipeNotification')
            .should('exist')
      })

      it('Link', () => {
         cy.mountSwipe()
            .pushSwipeSuccess()

            .get('.Link')
            .realSwipe('toRight', { length: WIDTH })

            .get('.SwipeNotification')
            .should('exist')
      })
   })
})
