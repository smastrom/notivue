import Slot from './components/Slot.vue'

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
      cy.mount(Slot, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotAgainst(options)
   })

   it('Error', () => {
      const _options = { ...options, ariaLive: 'polite', ariaRole: 'status' } // Override to keep all different

      cy.mount(Slot, { config: {} }, { props: { options: _options } } as any)

         .get('.Error')
         .click()
         .checkSlotAgainst(_options)
   })

   it('Warning', () => {
      const _options = { ...options, ariaRole: 'status' } // Same

      cy.mount(Slot, { config: {} }, { props: { options: _options } } as any)

         .get('.Warning')
         .click()
         .checkSlotAgainst(_options)
   })

   it('Info', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Info')
         .click()
         .checkSlotAgainst(options)
   })

   it('Promise', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Promise')
         .click()
         .checkSlotAgainst(options)
   })
})
