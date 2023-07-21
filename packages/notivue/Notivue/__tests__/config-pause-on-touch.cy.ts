import Notivue from './components/Notivue.vue'

import { FIXED_TIMEOUT_INCREMENT } from '@/core/constants'

import type { VueWrapper } from '@vue/test-utils'

describe('Pause on touch', { browser: ['chrome'] }, () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Touch - Can pause and resume notifications', () => {
      cy.mount(Notivue)

         .clickRandomStatic()
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

         .clickRandomStatic()
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

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .trigger('pointerdown', { pointerType: 'touch' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')
   })
})
