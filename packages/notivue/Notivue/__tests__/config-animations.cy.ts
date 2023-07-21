import Notivue from './components/Notivue.vue'

import type { VueWrapper } from '@vue/test-utils'

// In cypress/support/styles.css
const customAnims = {
   enter: 'fade-in',
   leave: 'fade-out',
   clearAll: 'fade-all',
}

describe('Animations', () => {
   it('Custom animations classes are toggled properly', () => {
      cy.mount(Notivue, { config: { animations: customAnims } }).checkAnimations(
         `.${customAnims.enter}`,
         `.${customAnims.leave}`,
         `.${customAnims.clearAll}`
      )
   })

   it('Custom animations are merged properly with defaults', () => {
      const _customAnimations = { ...customAnims } as Partial<typeof customAnims>
      delete _customAnimations.enter

      cy.mount(Notivue, { config: { animations: _customAnimations } }).checkAnimations(
         '.Notivue__enter',
         '.fade-out',
         '.fade-all'
      )
   })

   it('Should update animations config dynamically', () => {
      cy.mount(Notivue)
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ animations: customAnims }))

         .checkAnimations(
            `.${customAnims.enter}`,
            `.${customAnims.leave}`,
            `.${customAnims.clearAll}`
         )
   })
})
