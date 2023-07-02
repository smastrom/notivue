import Slot from './components/Slot.vue'

const options = {
   duration: 1000,
   class: 'CustomClass',
   title: 'CustomTitle',
   message: 'CustomMessage',
   ariaLive: 'assertiveCustom',
   ariaRole: 'alertCustom',
   closeAriaLabel: 'CustomClose',
}

describe('Custom notification options match the slot content', () => {
   const componentConfig = [{ config: {} }, { props: { options } } as any]

   it('Success', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotAgainst(options)
   })

   it('Error', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Error')
         .click()
         .checkSlotAgainst(options)
   })

   it('Warning', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Warning')
         .click()
         .checkSlotAgainst(options)
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
