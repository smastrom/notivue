import { DEFAULT_DURATION, MOTION_VARS } from '@/core/constants'

describe('Animations', () => {
   it('Enter, leave, and clearAll use motion CSS variables', () => {
      cy.mountNotivue().checkAnimations()
   })

   it('Custom motion CSS variables are applied', () => {
      cy.mountNotivue()

      cy.document().then((doc) => {
         doc.documentElement.style.setProperty(MOTION_VARS.enterAnimation, 'fade-kf 300ms ease')
         doc.documentElement.style.setProperty(MOTION_VARS.leaveAnimation, 'fade-kf 300ms ease')
         doc.documentElement.style.setProperty(
            MOTION_VARS.clearAllAnimation,
            'fade-kf 600ms ease forwards'
         )
      })

      cy.get('.Success').click()

      cy.getContainer().should(($el) => {
         const style = getComputedStyle($el[0])

         expect(style.animationName).to.eq('fade-kf')
         expect(style.animationDuration).to.eq('0.3s')
      })

      cy.wait(DEFAULT_DURATION)

      cy.getContainer().should(($el) => {
         const style = getComputedStyle($el[0])

         expect(style.animationName).to.eq('fade-kf')
         expect(style.animationDuration).to.eq('0.3s')
      })

      cy.get('.Success').click()
      cy.get('.ClearAll').click()

      cy.get('ol').should(($el) => {
         const style = getComputedStyle($el[0])

         expect(style.animationName).to.eq('fade-kf')
         expect(style.animationDuration).to.eq('0.6s')
      })
   })
})
