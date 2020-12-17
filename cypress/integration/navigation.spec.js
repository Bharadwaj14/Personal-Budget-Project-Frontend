/// <reference types="cypress" />


context('Home', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login')
  })

  it('should have Personal Budget in the h1', ()=>{
    cy.get('h1').contains('Personal Budget')
  })


  it('should look the same', () => {
    cy.eyesOpen({
      appName: 'My New App',
      testName: 'HomePage check'
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  })
})
