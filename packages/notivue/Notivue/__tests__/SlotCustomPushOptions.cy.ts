import Push from './components/Push.vue'

const options = {
   duration: 1000,
   class: 'CustomClass',
   title: 'CustomTitle',
   message: 'CustomMessage',
   ariaLive: 'assertive',
   ariaRole: 'alert',
   closeAriaLabel: 'CustomClose',
} // All different

describe('Custom notification options match the slot content', () => {
   const componentConfig = [{ config: {} }, { props: { options } } as any]

   it('Success', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotAgainst(options)
   })

   it('Error', () => {
      const _options = { ...options, ariaLive: 'polite', ariaRole: 'status' } // Override to keep all different

      cy.mount(Push, { config: {} }, { props: { options: _options } } as any)

         .get('.Error')
         .click()
         .checkSlotAgainst(_options)
   })

   it('Warning', () => {
      const _options = { ...options, ariaRole: 'status' } // Same

      cy.mount(Push, { config: {} }, { props: { options: _options } } as any)

         .get('.Warning')
         .click()
         .checkSlotAgainst(_options)
   })

   it('Info', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Info')
         .click()
         .checkSlotAgainst(options)
   })

   it('Promise', () => {
      cy.mount(Push, ...componentConfig)

         .get('.Promise')
         .click()
         .checkSlotAgainst(options)
   })
})
