import Push from './components/Slot.vue'

describe('Transition styles are injected correctly', () => {
   it('Top alignment', () => {
      cy.mount(Push)

      for (let i = 0; i < 20; i++) cy.get('.Success').click()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitionStyles(notification, accHeights)

            accHeights += notification.clientHeight
         })
      })
   })

   it('Bottom alignment', () => {
      cy.mount(Push, { config: { position: 'bottom-center' } })

      for (let i = 0; i < 20; i++) cy.get('.Success').click()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitionStyles(notification, accHeights)

            accHeights += notification.clientHeight * -1
         })
      })
   })
})
