import {
   DEFAULT_ENTER_LEAVE_ANIM_DURATION as ANIM_DUR,
   SWIPE_NOTIFICATION_WIDTH as WIDTH,
} from '@/support/utils'

describe('Styles', () => {
   it('Should have no transforms applied once returned to initial position', () => {
      cy.mountSwipe()
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH * 0.2 })

         .get('.SwipeNotification')
         .invoke('css', 'transform')
         .should('be.eq', 'none')
   })

   it('Should force `user-select: none;` if swipeable', () => {
      cy.mountSwipe()
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .children()
         .should('have.css', 'user-select', 'none')
   })

   it('Should not force `user-select: none;` if not swipeable', () => {
      cy.mountSwipe()
         .get('.Promise')
         .click()
         .wait(ANIM_DUR)

         .get('.SwipeNotification')
         .should('have.css', 'user-select', 'auto')
   })
})
