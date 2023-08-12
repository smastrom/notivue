import { RESOLVE_REJECT_DELAY, getRandomInt } from '@/support/utils'

import type { VueWrapper } from '@vue/test-utils'

describe('Enqueue', () => {
   it('Should enqueue notifications according to limit', () => {
      const limit = getRandomInt(1, 8)

      cy.mountNotivue({ config: { enqueue: true, limit } })

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', limit, { timeout: 0 })
   })

   it('Should display enqueued notifications after dismissal', () => {
      const limit = 3
      cy.mountNotivue({ config: { enqueue: true, limit } })

      for (let i = 0; i < 10; i++) {
         cy.clickRandomStatic()

         if (i === 2 || i === 5 || i === 8) {
            cy.get('.ClearButton')
               .eq(0)
               .click()
               .getNotifications()
               .should('have.length', limit, { timeout: 0 })
         }
      }
   })

   it('Should update promises in the queue', () => {
      const limit = 1
      const resolvedMessage = 'Promise resolved in the queue!'

      cy.mountNotivue({
         config: { enqueue: true, limit },
         props: {
            newOptions: {
               message: 'Promise resolved in the queue!',
            },
         },
      })
         .clickRandomStatic()
         .get('.PushPromiseAndResolve')
         .click()
         .wait(RESOLVE_REJECT_DELAY)

         .get('.ClearButton')
         .click()

         .getNotifications()
         .should('contain.text', resolvedMessage, { timeout: 0 })
   })

   it('Should update enqueue option dynamically', () => {
      const limit = getRandomInt(1, 8)

      cy.mountNotivue()
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ enqueue: true, limit }))

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', limit)
   })
})
