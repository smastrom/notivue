import Notivue from './components/Notivue.vue'

import type { VueWrapper } from '@vue/test-utils'

describe('Pause on hover', () => {
   beforeEach(() => {
      cy.throwIfDurationMismatch(6000)
   })

   it('Can pause and resume notifications', () => {
      cy.mountNotivue()

         .clickRandomStatic()
         .wait(4000) // Remaining time 2000ms

         .get('.Notification')
         .realMouseMove(0, 0, { position: 'center' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('exist')

         .get('body')
         .realMouseMove(50, 50, { position: 'bottomRight' })
         .wait(2000)

         .get('.Notification')
         .should('not.exist')
   })

   it('Should not pause notifications if pauseOnHover is false', () => {
      cy.mountNotivue({ config: { pauseOnHover: false } })

         .clickRandomStatic()
         .wait(4000) // Remaining: 2000ms

         .get('.Notification')
         .realMouseMove(0, 0, { position: 'center' })
         .wait(4000) // Any value greater than the remaining time

         .get('.Notification')
         .should('not.exist')
   })

   it('Should update config dynamically and work', () => {
      cy.mountNotivue({ config: { pauseOnHover: false } })

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
