import type { VueWrapper } from '@vue/test-utils'

describe('Duplicates', () => {
   it('Should not create duplicates if static', () => {
      cy.mountNotivue({ config: { avoidDuplicates: true } })

      for (let i = 0; i < 10; i++) {
         cy.clickAllStatic()
      }

      cy.getNotifications().should('have.length', 4, { timeout: 0 })
   })

   it('Should create duplicates if dynamic', () => {
      cy.mountNotivue({ config: { avoidDuplicates: true } })

      for (let i = 0; i < 10; i++) {
         cy.get('.Promise').click()
      }

      cy.getNotifications().should('have.length', 10, { timeout: 0 })
   })

   it('Should replace duration correctly', () => {
      cy.mountNotivue({ config: { avoidDuplicates: true } })

      cy.get('.Success').click()

      cy.wait(3000) // Remaining time 3s

      cy.get('.Success').click() // Remaining time 6s

      cy.wait(5000) // Remaining time 1s

      cy.getNotifications().should('have.length', 1, { timeout: 0 })
   })

   it('Should update config dynamically and work', () => {
      cy.mountNotivue({ config: { avoidDuplicates: false } })

      cy.get<VueWrapper>('@vue').then((wrapper) => {
         wrapper.setProps({ avoidDuplicates: true })

         for (let i = 0; i < 10; i++) {
            cy.clickAllStatic()
         }

         cy.getNotifications().should('have.length', 4, { timeout: 0 })
      })
   })
})
