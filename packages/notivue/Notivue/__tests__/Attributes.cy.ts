import Notivue from './components/Notivue.vue'

it('Notivue attributes are added correctly', () => {
   cy.mount(
      Notivue,
      { config: {} },
      {
         props: {
            class: 'CustomClass',
         } as any,
      }
   )

      .get('.Success')
      .click()
      .get('ol')
      .should('have.class', 'CustomClass')
      .get('li')
      .invoke('attr', 'data-notivue-id')
      .should('exist')
      .get('li')
      .invoke('attr', 'data-notivue-y')
      .should('exist')
})
