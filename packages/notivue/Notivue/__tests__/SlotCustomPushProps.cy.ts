import Slot from './components/Slot.vue'

const customProps = {
   isCustom: true,
   something: {
      name: 'something',
      value: 333,
      somethingElse: {
         name: 'somethingElse',
      },
   },
}

describe('Custom props match the slot content', () => {
   const componentConfig = [{ config: {} }, { props: { options: { props: customProps } } } as any]

   it('Success', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Success')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Error', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Error')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Warning', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Warning')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Info', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Info')
         .click()
         .checkSlotPropsAgainst(customProps)
   })

   it('Promise', () => {
      cy.mount(Slot, ...componentConfig)

         .get('.Promise')
         .click()
         .checkSlotPropsAgainst(customProps)
   })
})
