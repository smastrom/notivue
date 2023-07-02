import { defaultConfig } from '@/core/config'
import Slot from './components/Slot.vue'

it('All elements should be accessible', () => {
   const config = defaultConfig.notifications

   cy.mount(Slot)

      .get('.Success')
      .click()
      .get('li > div > div:last-of-type')
      .should('have.attr', 'aria-live', config.success.ariaLive)
      .should('have.attr', 'role', config.success.ariaRole)

      .get('.Error')
      .click()
      .get('li > div > div:last-of-type')
      .should('have.attr', 'aria-live', config.error.ariaLive)
      .should('have.attr', 'role', config.error.ariaRole)

      .get('.Info')
      .click()
      .get('li > div > div:last-of-type')
      .should('have.attr', 'aria-live', config.info.ariaLive)
      .should('have.attr', 'role', config.info.ariaRole)

      .get('.Warning')
      .click()
      .get('li > div > div:last-of-type')
      .should('have.attr', 'aria-live', config.warning.ariaLive)
      .should('have.attr', 'role', config.warning.ariaRole)

      .get('.Promise')
      .click()
      .get('li > div > div:last-of-type')
      .should('have.attr', 'aria-live', config.promise.ariaLive)
      .should('have.attr', 'role', config.promise.ariaRole)

   cy.injectAxe()
   cy.checkA11y('.Root')
})
