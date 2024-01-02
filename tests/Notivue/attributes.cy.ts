it('Notivue attributes are added correctly', () => {
   cy.mountNotivue({
      props: {
         class: 'CustomClass',
      },
   })

      .clickRandomStatic()

      .get('ol')
      .should('have.class', 'CustomClass')
      .invoke('attr', 'data-notivue-align')
      .should('exist')

      .get('li')
      .and('have.attr', 'tabindex', '-1')
      .invoke('attr', 'data-notivue-id')

      .get('li > div')
      .invoke('attr', 'data-notivue-container')
      .should('exist')
      .get('li > div')
      .invoke('attr', 'tabindex')
      .should('exist')
})
