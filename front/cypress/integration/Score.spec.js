/// <reference types="Cypress" />

describe('Score table is showing', () => {
    it('redirects to protected route', () => {
      cy.visit('/');
 
      cy.get('[data-test-cypress="scores"]').click();

      cy.contains('Highscores')
    });
});