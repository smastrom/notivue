import { MOTION_VARS_CSS } from '@/core/constants'

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
         .get('[data-notivue-item]')
         .should('exist')
         .should(($el) => {
            expect($el.attr('style') ?? '').not.to.include(MOTION_VARS_CSS.enterAnimation)
         })

         .get('.RenderedClear')
         .click()
         .get('[data-notivue-item]')
         .should('not.exist')
         .get(`[style*="${MOTION_VARS_CSS.leaveAnimation}"]`)
         .should('not.exist')
   })

   it('Should not add clearAll animation', () => {
      cy.mountNotivue()
         .clickRandomStatic()
         .get('ol')
         .should('exist')
         .get('.ClearAll')
         .click()
         .get('ol')
         .should('not.exist')
         .get(`[style*="${MOTION_VARS_CSS.clearAllAnimation}"]`)
         .should('not.exist')
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
