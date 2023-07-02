import { defaultConfig } from '@/core/config'

import Notivue from './components/Notivue.vue'

it('All elements should be accessible', () => {
   const config = defaultConfig.notifications

   cy.mount(Notivue)

      .get('.Success')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.success.ariaLive)
      .should('have.attr', 'role', config.success.ariaRole)

      .get('.Error')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.error.ariaLive)
      .should('have.attr', 'role', config.error.ariaRole)

      .get('.Info')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.info.ariaLive)
      .should('have.attr', 'role', config.info.ariaRole)

      .get('.Warning')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.warning.ariaLive)
      .should('have.attr', 'role', config.warning.ariaRole)

      .get('.Promise')
      .click()
      .getAriaLive()
      .should('have.attr', 'aria-live', config.promise.ariaLive)
      .should('have.attr', 'role', config.promise.ariaRole)

   cy.injectAxe()
   cy.checkA11y('.Root')
})
