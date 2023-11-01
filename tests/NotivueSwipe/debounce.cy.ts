import { DEFAULT_ANIM_DURATION as LEAVE_ANIM_DUR, getRandomInt } from '@/support/utils'

import { DEBOUNCE } from '@/NotivueSwipe/constants'
import { DEFAULT_DURATION } from '@/core/constants'
import { SWIPE_NOTIFICATION_WIDTH as WIDTH } from '@/support/utils'

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
    * In order for those tests to be accurate, we need a way to track how much time Cypress
    * takes to swipe the element and to trigger pointer events.
    *
    * We can use Cypress retry-ability mixed with cy.then to track it.
    * In the first test, this matches the moment the element is removed from the DOM.
    *
    * We also add the leave animation duration to the wait time, to be even more accurate.
    */

   it('Resume is delayed after clearing', () => {
      cy.mountSwipe()

      let elapsed = Date.now()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification').eq(3).realSwipe('toLeft', { length: WIDTH })

      cy.get('.SwipeNotification')
         .should('have.length', LENGTH - 1)
         .then(() => {
            elapsed = Date.now() - elapsed
            console.log('Elapsed: ', elapsed)

            cy.wait(DEFAULT_DURATION - elapsed + DEBOUNCE.Touch + LEAVE_ANIM_DUR)
            cy.get('.SwipeNotification').should('have.length', LENGTH - 1)
         })
   })

   it('Resume is delayed after tapping an excluded element', () => {
      const child = getRandomInt(0, LENGTH - 1)

      cy.mountSwipe()

      let elapsed = Date.now()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.CloseButton')
         .eq(child)
         .trigger('pointerdown', pointerEventOptions)
         .then(() => {
            elapsed = Date.now() - elapsed
            console.log('Elapsed: ', elapsed)

            cy.wait(DEFAULT_DURATION - elapsed + DEBOUNCE.TouchExternal + LEAVE_ANIM_DUR)
            cy.get('.SwipeNotification').should('have.length', LENGTH - 1)
         })
   })

   it('Resume is delayed after tappping a notification', () => {
      const child = getRandomInt(0, LENGTH - 1)

      cy.mountSwipe()

      let elapsed = Date.now()

      for (let i = 0; i < LENGTH; i++) {
         cy.get('.Success').click()
      }

      cy.get('.SwipeNotification')
         .eq(child)
         .trigger('pointerdown', pointerEventOptions)
         .then(() => {
            cy.get('.SwipeNotification')
               .eq(child)
               .trigger('pointerup', pointerEventOptions)
               .then(() => {
                  elapsed = Date.now() - elapsed
                  console.log('Elapsed: ', elapsed)

                  cy.wait(DEFAULT_DURATION - elapsed + DEBOUNCE.Touch + LEAVE_ANIM_DUR)
                  cy.get('.SwipeNotification').should('have.length', LENGTH)
               })
         })
   })
})
