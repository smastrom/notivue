import {
   SWIPE_NOTIFICATION_WIDTH as WIDTH,
   DEFAULT_ANIM_DURATION as ANIM_DUR,
   getRandomInt,
} from '@/support/utils'

import { DEFAULT_DURATION } from '@/core/constants'

const REPEAT = 5

describe('Leave timeouts', () => {
   it('Should resume timeouts once cleared a notification', () => {
      const child = getRandomInt(0, REPEAT - 1)

      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.wait(ANIM_DUR)

      cy.get('.SwipeNotification').eq(child).realSwipe('toRight', { length: WIDTH })

      cy.wait(DEFAULT_DURATION)

      cy.get('.SwipeNotification').should('have.length', 0)
   })

   it('Should not resume timeouts if tapping back on a notification after clearing', () => {
      const child = getRandomInt(0, REPEAT - 1)

      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.wait(ANIM_DUR)

      cy.get('.SwipeNotification')
         .eq(child)
         .realSwipe('toRight', { length: WIDTH / 2 })

      cy.get('.SwipeNotification')
         .eq(0)
         .trigger('pointerdown', {
            force: true,
            eventConstructor: 'PointerEvent',
            pointerType: 'touch',
         })
         .wait(DEFAULT_DURATION * 2) // Hold for very long time

      cy.get('.SwipeNotification').should('have.length', REPEAT - 1)
   })
})
