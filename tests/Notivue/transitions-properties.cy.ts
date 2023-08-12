it('Transition properties are inherited correctly from CSS animations', () => {
   cy.mountNotivue({
      config: {
         animations: {
            enter: 'fade-in-test-prop',
            leave: 'fade-out-test-prop',
         },
      },
   })

   for (let i = 0; i < 20; i++) cy.clickRandomStatic()

   cy.get('li').then((notifications) => {
      notifications.each((_, notification) => {
         cy.wrap(notification)
            .should('have.attr', 'style')
            .and('include', 'transition-duration: 0.8s')
            .and('include', 'transition-timing-function: ease-in-out')
      })
   })
})
