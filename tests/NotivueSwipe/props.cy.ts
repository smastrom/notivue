import { SWIPE_NOTIFICATION_WIDTH as WIDTH } from '@/support/utils'

/**
 * Don't know why this test hangs the whole github action
 * even if it works and succeeds locally.
 *
 * Skipping it for now.
 *
 */
if (!Cypress.env('CYPRESS_CI')) {
   describe('Props', () => {
      it('Should not swipe if disabled', () => {
         cy.mountSwipe({ disabled: true })
            .pushSwipeSuccess()

            .get('.SwipeNotification')
            .realSwipe('toRight', { length: WIDTH })
            .should('exist')
      })

      it('Should clear with a lower threshold', () => {
         cy.mountSwipe({ threshold: 0.3 })
            .pushSwipeSuccess()

            .get('.SwipeNotification')
            .realSwipe('toRight', { length: WIDTH * 0.3 })

            .get('.SwipeNotification')
            .should('not.exist')
      })

      it('Should swipe if swiping excluded element', () => {
         cy.mountSwipe({ exclude: '.CloseButton' })
            .pushSwipeSuccess()

            .get('.CloseButton')
            .realSwipe('toRight', { length: WIDTH })

            .get('.SwipeNotification')
            .should('exist')
      })
   })
}
