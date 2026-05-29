describe('Animations', () => {
   it('Enter, leave, and clearAll use motion CSS variables', () => {
      cy.mountNotivue().checkAnimations()
   })

   it('Custom motion CSS variables are applied', () => {
      cy.mountNotivue()

      cy.document().then((doc) => {
         doc.documentElement.style.setProperty('--nv-enter-animation', 'fade-kf 300ms ease')
         doc.documentElement.style.setProperty('--nv-leave-animation', 'fade-kf 300ms ease')
         doc.documentElement.style.setProperty(
            '--nv-clear-all-animation',
            'fade-kf 600ms ease forwards'
         )
      })

      cy.checkAnimations()
   })
})
