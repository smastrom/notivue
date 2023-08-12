import { SWIPE_NOTIFICATION_WIDTH as WIDTH } from '@/support/utils'

describe('Props', () => {
   it('Should not swipe if disabled', () => {
      cy.mountSwipe({ props: { disabled: true } })
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH })
         .should('exist')
   })

   it('Should clear with a lower threshold', () => {
      cy.mountSwipe({ props: { threshold: 0.3 } })
         .pushSwipeSuccess()

         .get('.SwipeNotification')
         .realSwipe('toRight', { length: WIDTH * 0.3 })

         .get('.SwipeNotification')
         .should('not.exist')
   })

   it('Should swipe if swiping excluded element', () => {
      cy.mountSwipe({ props: { exclude: '.CloseButton' } })
         .pushSwipeSuccess()

         .get('.CloseButton')
         .realSwipe('toRight', { length: WIDTH })

         .get('.SwipeNotification')
         .should('exist')
   })

   it('Should not swipe with mouse', () => {
      cy.log("Cypress doesn't support this")
   })
})
