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

         .get('.SwipeNotification')
         .its('length')
         .should('be.eq', REPEAT - 1)

      cy.get('.SwipeNotification').eq(0).trigger('pointerdown', {
         force: true,
         eventConstructor: 'PointerEvent',
         pointerType: 'touch',
      })

      cy.wait(DEFAULT_DURATION * 2) // Very long time

      cy.get('.SwipeNotification').should('have.length', REPEAT - 1)
   })
})

describe.only('Debounce', () => {
   afterEach(() => {
      // Reset the state - https://github.com/dmtrKovalenko/cypress-real-events#2-when-i-am-doing-cyrealhover-hovering-state-is-not-resetting-after-my-checks
      cy.get('body').realTouch({ position: 'topLeft' })
   })

   it('Resume is delayed after clearing', () => {
      const child = getRandomInt(0, REPEAT - 1)

      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification')
         .eq(child)
         .realSwipe('toRight', { length: WIDTH / 2 })

      cy.wait(DEFAULT_DURATION + ANIM_DUR)

      cy.get('.SwipeNotification').should('have.length', REPEAT - 1)
   })

   it('Resume is delayed after tapping an excluded element', () => {
      const child = getRandomInt(0, REPEAT - 1)

      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.wait(DEFAULT_DURATION - 1000) // 1s remaining

      cy.get('.CloseButton').eq(child).realTouch({ position: 'center' })

      cy.wait(1000 + ANIM_DUR)

      cy.get('.SwipeNotification').should('have.length', REPEAT - 1)

      cy.get('body').realTouch({ position: 'topLeft' })
   })

   it('Resume is delayed after tappping a notification', () => {
      const child = getRandomInt(0, REPEAT - 1)

      cy.mountSwipe()

      for (let i = 0; i < REPEAT; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification').eq(child).realTouch({ position: 'center' })

      cy.wait(DEFAULT_DURATION + ANIM_DUR)

      cy.get('.SwipeNotification').should('have.length', REPEAT - 1)

      cy.get('body').realTouch({ position: 'topLeft' })
   })
})
