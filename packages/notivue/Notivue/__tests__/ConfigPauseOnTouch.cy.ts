import PauseOnHoverTouch from './components/PauseOnHoverTouch.vue'

import { FIXED_TIMEOUT_INCREMENT } from '@/core/constants'

import type { VueWrapper } from '@vue/test-utils'

describe('Pause on touch', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Touch - Can pause and resume notifications', () => {
      cy.mount(PauseOnHoverTouch)

         .get('.Push')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notivue__content-message')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notivue__notification')
         .should('exist')

         .get('body')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(2000 + FIXED_TIMEOUT_INCREMENT)

         .get('.Notivue__notification')
         .should('not.exist')
   })

   it('Touch - Should not pause notifications if pauseOnTouch is false', () => {
      cy.mount(PauseOnHoverTouch, { config: { pauseOnTouch: false } })

         .get('.Push')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notivue__content-message')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notivue__notification')
         .should('not.exist')
   })

   it('Touch - Should update config dynamically and work', () => {
      cy.mount(PauseOnHoverTouch, { config: { pauseOnTouch: false } })

         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ pauseOnTouch: true }))

         .get('.Push')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notivue__content-message')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notivue__notification')
         .should('exist')
   })
})
