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

      .clickRandomStatic()
      .get('ol')
      .should('have.class', 'CustomClass')
      .get('li')
      .invoke('attr', 'data-notivue-id')
      .should('exist')
      .get('ol')
      .invoke('attr', 'data-notivue-align')
      .should('exist')
})
