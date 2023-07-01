import Push from './components/Push.vue'

describe('Only exposed keys are defined', () => {
   it('Success', () => {
      cy.mount(Push)

         .get('.Success')
         .click()
         .getNotification()
   })
})
