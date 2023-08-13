import { SWIPE_NOTIFICATION_WIDTH as WIDTH } from '@/support/utils'

/**
 * Don't know why this test hangs the whole github action
 * but works and succeeds locally.
 *
 * Disabling it for now.
 */

if (!Cypress.env('CYPRESS_SKIP_BUGGED_CI_TEST')) {
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
   })
}