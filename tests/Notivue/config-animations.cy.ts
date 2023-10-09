import type { VueWrapper } from '@vue/test-utils'

// In cypress/support/styles.css
const customAnims = {
   enter: 'fade-in',
   leave: 'fade-out',
   clearAll: 'fade-all',
}

describe('Animations', () => {
   it('Custom animations classes are toggled properly', () => {
      cy.mountNotivue({ config: { animations: customAnims } }).checkAnimations(
         `.${customAnims.enter}`,
         `.${customAnims.leave}`,
         `.${customAnims.clearAll}`
      )
   })

   it('Custom animations are merged properly with defaults', () => {
      cy.mountNotivue({
         config: {
            animations: {
               leave: customAnims.leave,
               clearAll: customAnims.clearAll,
            },
         },
      }).checkAnimations('.Notivue__enter', '.fade-out', '.fade-all')
   })

   it('Should update animations config dynamically', () => {
      cy.mountNotivue()
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ animations: customAnims }))

         .checkAnimations(
            `.${customAnims.enter}`,
            `.${customAnims.leave}`,
            `.${customAnims.clearAll}`
         )
   })
})
