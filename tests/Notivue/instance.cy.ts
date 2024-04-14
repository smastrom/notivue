import type { VueWrapper } from '@vue/test-utils'

function testStoppedInstance() {
   cy.getNotifications().should('have.length', 0, { timeout: 0 })
   cy.get('.QueueCount').should('have.text', '0')
   cy.get('.EntriesCount').should('have.text', '0')
}

it('Instance is stopped correctly', () => {
   cy.mountNotivue()
   cy.clickAllStatic()

   cy.get('.StopInstance').click()
   cy.clickAllStatic()

   testStoppedInstance()
})

it('No new entries are added to the store if instance is stopped', () => {
   cy.mountNotivue({
      config: {
         limit: 4,
         enqueue: true,
      },
   })

   for (let i = 0; i < 10; i++) {
      cy.clickAllStatic()
   }

   cy.get('.StopInstance').click()
   testStoppedInstance()
})

it('Plugin can be installed without starting the instance', () => {
   cy.mountNotivue({
      config: {
         startOnCreation: false,
      },
   })

   cy.clickAllStatic()
   testStoppedInstance()
})

it('Instance can be stopped and started again', () => {
   cy.mountNotivue()

   for (let i = 0; i < 10; i++) {
      cy.get('.StopInstance').click()
      cy.clickAllStatic()
      testStoppedInstance()

      cy.get('.StartInstance')
         .click()
         .clickAllStatic()
         .getNotifications()
         .should('have.length', 4, { timeout: 0 })
         .get('.EntriesCount')
         .should('have.text', '4', { timeout: 0 })
   }
})

it('Config is not updated if instance is stopped', () => {
   cy.mountNotivue()

   const differentConfig = {
      pauseOnHover: false,
      pauseOnTouch: false,
      pauseOnTabChange: false,
      enqueue: true,
      position: 'bottom-center',
      teleportTo: 'html',
      limit: 3,
      avoidDuplicates: true,
   }

   cy.get('.Config')
      .invoke('text')
      .then((initialConfig) => {
         cy.get('.StopInstance').click()

         cy.get<VueWrapper>('@vue').then((wrapper) => {
            wrapper.setProps(differentConfig)

            cy.get('.Config')
               .invoke('text')
               .should((updatedConfig) => {
                  expect(updatedConfig).to.eq(initialConfig)
               })
         })
      })
})
