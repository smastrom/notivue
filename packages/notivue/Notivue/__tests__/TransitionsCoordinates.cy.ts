import Notivue from './components/Notivue.vue'

describe('Transition styles are injected correctly', () => {
   it('Top alignment', () => {
      cy.mount(Notivue)

      for (let i = 0; i < 20; i++) cy.get('.Success').click()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitions(notification, accHeights)

            accHeights += notification.clientHeight
         })
      })
   })

   it('Bottom alignment', () => {
      cy.mount(Notivue, { config: { position: 'bottom-center' } })

      for (let i = 0; i < 20; i++) cy.get('.Success').click()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitions(notification, accHeights)

            accHeights += notification.clientHeight * -1
         })
      })
   })
})
