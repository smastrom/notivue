describe('prefers-reduced-motion', () => {
   beforeEach(() => {
      cy.stub(window, 'matchMedia').withArgs('(prefers-reduced-motion: reduce)').returns({
         matches: true,
      })
   })

   it('Should not add enter/leave animation styles', () => {
      cy.mountNotivue()
         .get('.PushAndRenderClear')
         .click()
         .getContainer()
         .invoke('attr', 'style')
         .should('not.include', '--nv-enter-animation')

         .get('.RenderedClear')
         .click()
         .getContainer()
         .invoke('attr', 'style')
         .should('not.include', '--nv-leave-animation')
   })

   it('Should not add clearAll animation', () => {
      cy.mountNotivue()
         .clickRandomStatic()
         .get('.ClearAll')
         .click()
         .get('ol')
         .invoke('attr', 'style')
         .should('not.include', '--nv-clear-all-animation')
   })

   it('No transition should be applied', () => {
      cy.mountNotivue()
         .clickRandomStatic()
         .click()
         .get('li')
         .invoke('attr', 'style')
         .should('include', 'transition: none')
   })
})
