import Config from './components/Config.vue'

import type { VueWrapper } from '@vue/test-utils'

// In cypress/support/styles.css
const customAnims = {
   enter: 'fade-in',
   leave: 'fade-out',
   clearAll: 'fade-all',
}

describe('Animations', () => {
   it('Custom animations classes are toggled properly', () => {
      cy.mount(Config, { config: { animations: customAnims } }).checkAnimations(
         `.${customAnims.enter}`,
         `.${customAnims.leave}`,
         `.${customAnims.clearAll}`
      )
   })

   it('Custom animations are merged properly with defaults', () => {
      const _customAnimations = { ...customAnims } as Partial<typeof customAnims>
      delete _customAnimations.enter

      cy.mount(Config, { config: { animations: _customAnimations } }).checkAnimations(
         '.Notivue__enter',
         '.fade-out',
         '.fade-all'
      )
   })

   it.only('Should update animations config dynamically', () => {
      cy.mount(Config)
         .get<VueWrapper>('@vue')
         .then((wrapper) => wrapper.setProps({ animations: customAnims }))

         .checkAnimations(
            `.${customAnims.enter}`,
            `.${customAnims.leave}`,
            `.${customAnims.clearAll}`
         )
   })
})
