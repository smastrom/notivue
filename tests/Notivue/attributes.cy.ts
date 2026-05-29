it('Notivue attributes are added correctly', () => {
   cy.mountNotivue({
      props: {
         class: 'CustomClass',
      },
   })

      .clickRandomStatic()

      .get('ol')
      .should('have.class', 'CustomClass')
      .and('have.attr', 'data-notivue-align')

   cy.get('li').should(($li) => {
      expect($li).to.have.attr('tabindex', '-1')
      expect($li).to.have.attr('data-notivue-item')
      expect($li).to.have.attr('aria-label')
   })

   cy.get('li > div').should(($container) => {
      expect($container).to.have.attr('data-notivue-container')
      expect($container).not.to.have.attr('tabindex')
   })
})
