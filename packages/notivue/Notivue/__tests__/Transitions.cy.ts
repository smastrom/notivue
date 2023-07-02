import Push from './components/Slot.vue'

it('Transition properties are injected correctly', () => {
   cy.mount(Push)

   for (let i = 0; i < 20; i++) {
      cy.get('.Success').click()
   }

   cy.get('li').then((notifications) => {
      let accHeights = 0

      notifications.each((_, notification) => {
         cy.wrap(notification)
            .should('have.attr', 'style')
            .and('include', `transform: translate3d(0px, ${accHeights}px, 0px)`)
            .and('include', 'transition-duration: 300m')
            .and('include', 'transition-property: transform')
            .and('include', 'transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1)')

         accHeights += notification.clientHeight
      })
   })
})
