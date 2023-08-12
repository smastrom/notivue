describe('Transition styles are injected correctly', () => {
   it('Top alignment', () => {
      cy.mountNotivue()

      for (let i = 0; i < 20; i++) cy.clickRandomStatic()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitions(notification, accHeights)

            accHeights += notification.clientHeight
         })
      })
   })

   it('Bottom alignment', () => {
      cy.mountNotivue({ config: { position: 'bottom-center' } })

      for (let i = 0; i < 20; i++) cy.clickRandomStatic()

      cy.get('li').then((notifications) => {
         let accHeights = 0

         notifications.each((_, notification) => {
            cy.checkTransitions(notification, accHeights)

            accHeights += notification.clientHeight * -1
         })
      })
   })
})
