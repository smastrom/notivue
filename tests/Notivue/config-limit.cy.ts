import type { VueWrapper } from '@vue/test-utils'

describe('Limit', () => {
   it('User-defined limit works correctly', () => {
      cy.mountNotivue({ config: { limit: 5 } })

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', 5)
   })

   it('Should update limit dynamically', () => {
      cy.mountNotivue()
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ limit: 8 }))

      for (let i = 0; i < 20; i++) {
         cy.clickRandomStatic()
      }

      cy.getNotifications().should('have.length', 8)
   })
})
