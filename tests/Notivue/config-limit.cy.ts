import { getRandomInt } from '@/support/utils'

import type { VueWrapper } from '@vue/test-utils'

describe('Limit', () => {
   it('User-defined limit works correctly', () => {
      const limit = getRandomInt(1, 8)

      cy.mountNotivue({ config: { limit } })

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', limit, { timeout: 0 })
   })

   it('Should update limit dynamically', () => {
      const newLimit = getRandomInt(1, 8)

      cy.mountNotivue()
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ limit: newLimit }))

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', newLimit, { timeout: 0 })
   })
})
