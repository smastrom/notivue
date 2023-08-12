describe('prefers-reduced-motion', () => {
   beforeEach(() => {
      cy.stub(window, 'matchMedia').withArgs('(prefers-reduced-motion: reduce)').returns({
         matches: true,
      })
   })

   it('Should not add enter/leave animation classes', () => {
      cy.mountNotivue()
         .get('.PushAndRenderClear')
         .click()
         .get('.Notivue__enter')
         .should('not.exist')

         .get('.RenderedClear')
         .click()
         .get('.Notivue__leave')
         .should('not.exist')
   })

   it('Should not add clearAll animation', () => {
      cy.mountNotivue()
         .clickRandomStatic()
         .get('.ClearAll')
         .click()
         .get('.Notivue__clearAll')
         .should('not.exist')
   })

   it('No transition should be applied', () => {
      cy.mountNotivue()
         .clickRandomStatic()
         .click()
         .getNotifications()
         .should('have.css', 'transition', 'all 0s ease 0s')
   })
})
