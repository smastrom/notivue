import { SWIPE_NOTIFICATION_WIDTH as WIDTH } from '@/support/utils'

import { DEFAULT_DURATION } from '@/core/constants'

const REPEAT = 5

describe('Leave timeouts', () => {
   it('Should resume timeouts once cleared a notification', () => {
      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification')
         .eq(2)
         .realSwipe('toRight', { length: WIDTH / 2 })

         .get('.SwipeNotification')
         .should('have.length', REPEAT - 1)
         .wait(DEFAULT_DURATION)

         .get('.SwipeNotification')
         .should('have.length', 0)
   })

   it('Should resume timeouts once cleared last notification', () => {
      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification')
         .last()
         .realSwipe('toRight', { length: WIDTH / 2 })

         .wait(DEFAULT_DURATION)

         .get('.SwipeNotification')
         .should('have.length', 0)
   })

   it('Should not resume timeouts if hovering back on a notification', () => {
      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification')
         .eq(3)
         .realSwipe('toRight', { length: WIDTH / 2 })

         .get('.SwipeNotification')
         .its('length')
         .should('be.eq', REPEAT - 1)

         .get('.SwipeNotification')
         .eq(0)
         .realHover({ position: 'center' })
         .wait(DEFAULT_DURATION * 2) // Very long time

         .get('.SwipeNotification')
         .should('have.length', REPEAT - 1)
   })
})
