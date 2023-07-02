import Notivue from './components/Notivue.vue'

import { FIXED_TIMEOUT_INCREMENT } from '@/core/constants'

import type { VueWrapper } from '@vue/test-utils'

describe('Pause on touch', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Touch - Can pause and resume notifications', () => {
      cy.mount(Notivue)

         .get('.Success')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')

         .get('body')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(2000 + FIXED_TIMEOUT_INCREMENT)

         .get('.Notification')
         .should('not.exist')
   })

   it('Touch - Should not pause notifications if pauseOnTouch is false', () => {
      cy.mount(Notivue, { config: { pauseOnTouch: false } })

         .get('.Success')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('not.exist')
   })

   it('Touch - Should update config dynamically and work', () => {
      cy.mount(Notivue, { config: { pauseOnTouch: false } })

         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ pauseOnTouch: true }))

         .get('.Success')
         .click()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')
   })
})
