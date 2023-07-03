import Notivue from './components/Notivue.vue'

import { FIXED_TIMEOUT_INCREMENT } from '@/core/constants'

import type { VueWrapper } from '@vue/test-utils'

describe('Pause on hover', { browser: ['chrome'] }, () => {
   beforeEach(() => {
      cy.log('cypress-real-events is only supported in Chrome').throwIfDurationMismatch(6000)
   })

   it('Can pause and resume notifications', () => {
      cy.mount(Notivue)

         .clickRandomStatic()
         .wait(4000) // Remaining time 2000ms

         .get('.Notification')
         .realMouseMove(0, 0, { position: 'center' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')

         .get('body')
         .realMouseMove(50, 50, { position: 'bottomRight' })
         .wait(2000 + FIXED_TIMEOUT_INCREMENT)

         .get('.Notification')
         .should('not.exist')
   })

   it('Should not pause notifications if pauseOnHover is false', () => {
      cy.mount(Notivue, { config: { pauseOnHover: false } })

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .realMouseMove(0, 0, { position: 'center' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('not.exist')
   })

   it('Should update config dynamically and work', () => {
      cy.mount(Notivue, { config: { pauseOnHover: false } })

         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ pauseOnHover: true }))

         .clickRandomStatic()
         .wait(4000) // Remaining time 2000ms

         .get('.Notification')
         .realMouseMove(0, 0, { position: 'center' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')
   })
})
