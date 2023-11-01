import { getRandomInt } from '@/support/utils'

import { DEBOUNCE } from '@/NotivueSwipe/constants'
import { DEFAULT_DURATION } from '@/core/constants'

const LENGTH = 5

const pointerEventOptions = {
   force: true,
   eventConstructor: 'PointerEvent',
   pointerType: 'touch',
}

describe('Debounce', () => {
   beforeEach(() => {
      cy.viewport('iphone-x')
   })

   /**
    * Remove 100ms from debounce time to account for the time Cypress takes
    * to perform the actions before
    */

   it('Resume is delayed after clearing', () => {
      const child = getRandomInt(0, LENGTH - 1)

      cy.mountSwipe()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification').eq(child).trigger('pointerdown', pointerEventOptions)
      cy.get('.SwipeNotification')
         .eq(child)
         .trigger('pointermove', {
            ...pointerEventOptions,
            clientX: 1000,
         })

      cy.wait(DEFAULT_DURATION + (DEBOUNCE.Touch - 100))

      cy.get('.SwipeNotification').should('have.length', LENGTH - 1)
   })

   it('Resume is delayed after tapping an excluded element', () => {
      const child = getRandomInt(0, LENGTH - 1)

      cy.mountSwipe()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.CloseButton').eq(child).trigger('pointerdown', pointerEventOptions)

      cy.wait(DEFAULT_DURATION + (DEBOUNCE.TouchExternal - 100))

      cy.get('.SwipeNotification').should('have.length', LENGTH - 1)
   })

   it('Resume is delayed after tappping a notification', () => {
      const child = getRandomInt(0, LENGTH - 1)

      cy.mountSwipe()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification').eq(child).trigger('pointerdown', pointerEventOptions)
      cy.get('.SwipeNotification').eq(child).trigger('pointerup', pointerEventOptions)

      cy.wait(DEFAULT_DURATION + (DEBOUNCE.Touch - 100))

      cy.get('.SwipeNotification').should('have.length', LENGTH)
   })
})
